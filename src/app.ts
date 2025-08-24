import express from "express";
import errorResponseHandler from "./middlewares/errorHandler";
import conversationRoutes from "./modules/conversation/conversation.route";
import userRoutes from "./modules/user/user.route";

const app = express(),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express API with Swagger",
      version: "0.1.0",
      description: "This is a simple CRUD API application made with Express and documented with Swagger",
    },
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

// Routes
const baseUrl = "/api";
app.use(`${baseUrl}/users`, userRoutes);
app.use(`${baseUrl}/conversations`, conversationRoutes);
app.use(errorResponseHandler);

export default app;
