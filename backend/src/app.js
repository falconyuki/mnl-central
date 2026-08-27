import express from "express";
import cors from "cors";

import appConfig from "./config/appConfig.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./errors/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { requestLogger } from "./logging/requestLogger.js";

const app = express();

app.use(requestContext);
app.use(requestLogger);

app.use(express.json());
app.use(
  cors({
    origin:
      appConfig.app.environment === "production" ? appConfig.cors.origin : true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1", apiRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
