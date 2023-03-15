"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static associate(models) {
      // define association here
    }

    static async showList() {
      console.log("My Todo list \n");
      console.log("Overdue");
      await this.overdue();
      //hmm
      //let overDueItems = this.overdue();
      //overDueItems.forEach((item) => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Today");
      //hmm
      await this.dueToday();

      console.log("Due Later");
      //hmm
      await this.dueLater();
    }

    static async overdue() {
      try {
        const todos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
          },
          order: [["id", "ASC"]], //idk if it still rejects :/
        });
        const todoList = todos
          .map((todoItem) => todoItem.displayableString())
          .join("\n");
        console.log(todoList);
      } catch (error) {
        console.error(error);
      }
    }

    static async dueToday() {
      try {
        const todos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.eq]: new Date(),
            },
          },
          order: [["id", "ASC"]],
        });

        const todoList = todos
          .map((todoItem) => todoItem.displayTodayString())
          .join("\n");
        console.log(todoList);
      } catch (error) {
        console.error(error);
      }
    }

    static async dueLater() {
      try {
        const todos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
          },
          order: [["id", "ASC"]],
        });

        const todoList = todos
          .map((todoItem) => todoItem.displayableString())
          .join("\n");

        console.log(todoList);
      } catch (error) {
        console.error(error);
      }
    }

    static async markAsComplete(id) {
      const status = await Todo.update(
        {
          completed: true,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return status;
    }

    displayTodayString() {
      return `${this.id}. ${this.completed ? "[x]" : "[ ]"} ${
        this.title
      }`.trim();
    }
    displayableString() {
      return `${this.id}. ${this.completed ? "[x]" : "[ ]"} ${this.title} ${
        this.dueDate
      }`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
