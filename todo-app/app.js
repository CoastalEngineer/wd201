/*eslint-disable no-unused-vars */

const express = require("express");
const app = express();
var csurf = require("csurf");
var cookieParser = require("cookie-parser");
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csurf({ cookie: true }));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getAllTodos();
  const todayItems = await Todo.dueToday();
  const laterItems = await Todo.dueLater();
  const overdueItems = await Todo.overdue();

  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      todayItems,
      laterItems,
      overdueItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ allTodos, todayItems, laterItems, overdueItems });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response) => {
  // response.send("Todo List");
  try {
    const allTodos = await Todo.getAllTodos();
    const todayItems = await Todo.dueToday();
    const laterItems = await Todo.dueLater();
    const overdueItems = await Todo.overdue();

    if (request.accepts("html")) {
      response.render("index", {
        allTodos,
        todayItems,
        laterItems,
        overdueItems,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ allTodos, todayItems, laterItems, overdueItems });
    }
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

    return response.redirect("/");
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
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;

/*eslint-disable no-unused-vars */
