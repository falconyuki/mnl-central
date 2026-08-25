import express from "express";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./errors/errorHandler.js";
import { requestContext } from "./middleware/requestContext.js";
import { requestLogger } from "./logging/requestLogger.js";

const app = express();

app.use(requestContext);
app.use(requestLogger);

app.use(express.json());

app.use("/api/v1", apiRouter);

// Error handler middleware
app.use(errorHandler);

export default app;
