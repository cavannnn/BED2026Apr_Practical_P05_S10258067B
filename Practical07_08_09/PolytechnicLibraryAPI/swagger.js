const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

const doc = {
  info: {
    title: "Polytechnic Library API",
    description:
      "API for the Polytechnic Library system. Members and librarians can register, login and view books. Only librarians can update book availability.",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT token in the format: Bearer <token>",
    },
  },
  definitions: {
    Book: {
      book_id: 1,
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      availability: "Y",
    },
    RegisterRequest: {
      username: "member01",
      password: "password123",
      role: "member",
    },
    LoginRequest: {
      username: "member01",
      password: "password123",
    },
    AvailabilityRequest: {
      availability: "N",
    },
  },
};

swaggerAutogen(outputFile, routes, doc);
