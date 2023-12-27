"use strict";

const fastify = require("fastify")();
fastify.register(require("@fastify/cors"), {});
fastify.register(require("@fastify/websocket"));

fastify.register(async function (fastify) {
  fastify.get("/api/project/logs", { websocket: true }, (connection, req) => {
    connection.socket.on("message", (message) => {
      // connection.socket.send({
      //   logs: Array(50).fill({
      //     at: "09:35:10.031",
      //     application: "some-app",
      //     service: "some-service",
      //     kind: ["UNKNOWN", "PLUGIN", "SERVICE"][
      //       Math.floor(Math.random() * (2 - 0 + 1) + 0)
      //     ],
      //     message: "Previous build caches not available",
      //   }),
      // });
      connection.socket.send("Welcome to Ugee WS");
    });
  });
});

const routes = {
  "/api/project/information": require("./api/project.view.json"),
  "/api/application/:a/information": require("./api/application.view.json"),
  "/api/application/:a/service/:s/information": require("./api/service.information.json"),
  "/api/plugin/:publisher/:name/usage": require("./api/plugin.usage.json"),
};

for (const route in routes) {
  fastify.get(route, async (_, reply) => {
    reply.code(200).send(routes[route]);
  });
}

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`fastify listening at ${address}`);
});
