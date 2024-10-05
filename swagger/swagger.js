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
      url: "https://b56stage2-online-circle.vercel.app",
    },
    {
      url: "https://circle-staging.vercel.app",
    },
  ],
  components: {
    "@schemas": {
      CreateFollowDTO: {
        type: "object",
        properties: {
          followedId: {
            type: "integer",
            description: "ID of the user to be followed",
            example: 2
          }
        },
        required: ["followedId"]
      },
      logoutDTO: {
        "type": "object",
        "description": "DTO for logging out. No additional properties required."
      },
      AddThreadLikeDTO: {
        "type": "object",
        "properties": {
          "threadId": {
            "type": "integer",
          },
        },
        "required": ["threadId"]
      },
      RemoveThreadLikeDTO: {
        "type": "object",
        "properties": {
          "threadId": {
            "type": "integer",
          },
        },
      },
      AddReplyLikeDTO: {
        "type": "object",
        "properties": {
          "replyId": {
            "type": 'integer',
          },
        },
      },
      RemoveReplyLikeDTO: {
        "type": "object",
        "properties": {
          "replyId": {
            "type": "integer",
          },
        },
      },
      unfollowDTO: {
        type: "object",
        properties: {
          followedId: {
            type: "integer",
            description: "ID of the user to be unfollowed",
            example: 2
          }
        },
        required: ["followedId"]
      },      
      CreateReplyDTO: {
        type: "object",
        properties: {
            content: {
                type: "string",
            },
            image: {
                type: "string",
                format: "binary", 
            },
            threadId: {
                type: "integer", 
            },
        },
        required: ["content", "threadId"],
      },
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
            format: "binary"
          },
        },
        required: ["content"],
      },
      createUserDTO: {
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
      updateUserDTO: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
          },
          username: {
            type: "string",
          },
          bio: {
            type: "string",
          },
          image: {
            type: "string",
            format: "binary"
          },
          backgroundImage: {
            type: "string",
            format: "binary"
          },
        },
        required: ["fullName"],
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