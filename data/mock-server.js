const cors = require("@fastify/cors");
const Fastify = require("fastify");

const server = Fastify();
server.register(cors, {});

const routes = {
  "/api/project/information": require("./api/project.view.json"),
  "/api/application/:a/information": require("./api/application.view.json"),
  "/api/application/:a/service/:s/information": require("./api/service.information.json"),
  "/api/plugin/:publisher/:name/usage": require("./api/plugin.usage.json"),
};

for (const route in routes) {
  server.get(route, async (_, reply) => {
    reply.code(200).send(routes[route]);
  });
}

server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
