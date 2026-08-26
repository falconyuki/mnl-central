import app from "./src/app.js";
import appConfig from "./src/config/appConfig.js";
import { initializeDb } from "./src/database/initializeDb.js";

async function startServer() {
  await initializeDb();
  const server = app.listen(appConfig.app.port, () => {
    console.log(`MNL Central API listening on port ${appConfig.app.port}`);
  });
  return server;
}

const server = await startServer();

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close((error) => {
    if (error) {
      console.error("Error during server shutdown:", error);
      process.exit(1);
      return;
    }
    console.log("HTTP server closed.");
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default server;
