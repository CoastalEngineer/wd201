/*eslint-disable no-unused-vars */

const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.get("/todos", async (request, response) => {
  // response.send("Todo List");
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.error(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });

    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error); //unprocessable entity
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("Update todo with ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();

    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const deletedTodo = await todo.deleteTodo();
    response.json(true);
    return true;
  } catch (error) {
    console.error(error);
    response.status(422).json(false);
    return false;
  }
});

module.exports = app;

/*eslint-disable no-unused-vars */
