const http = require("http");
const fs = require("fs");
const args = require("minimist")(process.argv.slice(2), {
  default: {
    port: 5000,
  },
});

let homeContent = "";
let projectContent = "";
let registrationContent = "";

const createServerFromPort = (portNo) => {
  http
    .createServer((request, response) => {
      let url = request.url;
      response.writeHeader(200, { "Content-Type": "text/html" });
      switch (url) {
        case "/project":
          response.write(projectContent);
          response.end();
          break;

        case "/registration":
          response.write(registrationContent);
          response.end();
          break;

        default:
          response.write(homeContent);
          response.end();
          break;
      }
    })
    .listen(portNo);
};

fs.readFile("home.html", (err, data) => {
  if (err) throw err;
  homeContent = data.toString();
});

fs.readFile("project.html", (err, data) => {
  if (err) throw err;
  projectContent = data.toString();
});

fs.readFile("registration.html", (err, data) => {
  if (err) throw err;
  registrationContent = data.toString();
});

createServerFromPort(args.port);
