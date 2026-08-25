import app from "./src/app.js";
import appConfig from "./src/config/appConfig.js";
import { initializeDb } from "./src/database/initializeDb.js";

async function startServer() {
  await initializeDb();
  app.listen(appConfig.app.port, () => {
    console.log(`MNL Central API listening on port ${appConfig.app.port}`);
  });
}

const server = await startServer();

export default server;
