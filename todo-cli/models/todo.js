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

      let overDueItems = await this.overdue();
      overDueItems = overDueItems
        .map((item) => item.displayableString())
        .join("\n");
      console.log(overDueItems);
      console.log("\n");

      console.log("Due Today");
      //hmm
      let dueTodayItems = await this.dueToday();
      dueTodayItems = dueTodayItems
        .map((item) => item.displayableString())
        .join("\n");
      console.log(overDueItems);

      console.log("\n");

      console.log("Due Later");
      //hmm
      let dueLaterItems = await this.dueLater();
      dueLaterItems = dueLaterItems
        .map((item) => item.displayableString())
        .join("\n");
      console.log(dueLaterItems);
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

        return todos;
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

        return todos;
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

        return todos;
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

    displayableString() {
      let today = new Date();
      if (this.dueDate === today) {
        return `${this.id}. ${this.completed ? "[x]" : "[ ]"} ${
          this.title
        }`.trim();
      } else {
        return `${this.id}. ${this.completed ? "[x]" : "[ ]"} ${this.title} ${
          this.dueDate
        }`.trim();
      }
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
