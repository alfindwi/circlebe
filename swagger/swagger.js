const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
  autoHeaders: false,
});

const doc = {
  info: {
    title: "Circle",
    description: "Circle API Documentation",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
    {
      url: "https://circle.vercel.app",
    },
    {
      url: "https://circle-staging.vercel.app",
    },
  ],
  components: {
    "@schemas": {
      CreateThreadDTO: {
        type: "object",
        properties: {
          content: {
            type: "string",
          },
          image: {
            type: "string",
            format: "binary"
          },
        },
        required: ["content"],
      },
      UpdateThreadDTO: {
        type: "object",
        properties: {
          content: {
            type: "string",
          },
          image: {
            type: "string",
          },
        },
        required: ["content"],
      },
      LoginDTO: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
          },
          passwordUsers: {
            type: "string",
            format: "passwordUsers",
          },
        },
        required: ["email", "passwordUsers"],
      },
      RegisterDTO: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          passwordUsers: {
            type: "string",
            format: "passwordUsers",
          },
          username: {
            type: "string",
            format: "username",
          },
        },
        required: ["fullName", "email", "passwordUsers"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  host: "localhost:4000",
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);