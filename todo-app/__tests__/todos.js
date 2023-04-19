const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("response /todos", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark Complete", async () => {
    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const todoResponse = await agent.get("/").set("Accept", "application/json");
    const parsedResponse = JSON.parse(todoResponse.text);
    const todayItemsCount = parsedResponse.todayItems.length;
    const latestTodo = parsedResponse.todayItems[todayItemsCount - 1];

    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });

    const parsedCompleteResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedCompleteResponse.completed).toBe(true);
  });

  test("Mark Incomplete", async () => {
    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);

    await agent.post("/todos").send({
      title: "Buy Milk",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });

    const todoResponse = await agent.get("/").set("Accept", "application/json");
    const parsedResponse = JSON.parse(todoResponse.text);
    const todayItemsCount = parsedResponse.todayItems.length;
    const latestTodo = parsedResponse.todayItems[todayItemsCount - 1];

    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: false,
      });

    const parsedCompleteResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedCompleteResponse.completed).toBe(false);
  });

  test("Delete test", async () => {
    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Item to Delete",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const todoResponse = await agent.get("/").set("Accept", "application/json");
    const parsedResponse = JSON.parse(todoResponse.text);
    const dueTodayCount = parsedResponse.todayItems.length;
    const latestTodo = parsedResponse.todayItems[dueTodayCount - 1];
    const todoID = latestTodo.id;
    var res = await agent.get("/");
    var csrfToken = extractCsrfToken(res);
    const deletedResponse = await agent.delete(`/todos/${todoID}`).send({
      _csrf: csrfToken,
    });
    const parsedDeletedResponse = JSON.parse(deletedResponse.text);
    expect(deletedResponse.statusCode).toBe(200);
    expect(parsedDeletedResponse.success).toBe(true);
  });
});
