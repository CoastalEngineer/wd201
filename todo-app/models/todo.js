"use strict";
const { Model, where, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static async getAllTodos() {
      return this.findAll();
    }

    static async overdue() {
      try {
        return this.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]], //idk if it still rejects :/
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async dueToday() {
      try {
        return this.findAll({
          where: {
            dueDate: {
              [Op.eq]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]],
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async dueLater() {
      try {
        return this.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
            completed: false,
          },
          order: [["id", "ASC"]],
        });
      } catch (error) {
        console.error(error);
      }
    }

    static async completed() {
      try {
        return this.findAll({
          where: {
            completed: true,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    setCompletionStatus(bool) {
      return this.update({ completed: bool });
    }

    markAsCompleted() {
      return this.update({ completed: !this.completed });
    }

    static async remove(id) {
      return this.destroy({ where: { id: id } });
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
