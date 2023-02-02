const swaggerUI = require("swagger-ui-express");
const swaggerJsDOC = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "BCCS",
      description: "이더리움 기반 RESTFUL API 클라이언트",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "이성현",
        url: "https://github.com/coolmarvel",
        email: "marvel19971125@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
    securityDefinitions: {
      api_key: {
        type: "apiKey",
        in: "header",
        name: "api_key",
      },
    },
  },
  apis: [
    "./routes/*.js",
    "./routes/*/*.js",
    "./routes/*/*/*.js",
    "./routes/*/*/*/*.js",
    "./routes/*/*/*/*/*.js",
    "./routes/*/*/*/*/*/*.js",
  ],
};

const specs = swaggerJsDOC(options);

module.exports = { swaggerUI, specs };
