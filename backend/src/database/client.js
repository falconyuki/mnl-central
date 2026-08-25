import { createClient } from "@libsql/client";
import appConfig from "../config/appConfig.js";

const clientOptions = {
  url: appConfig.database.url,
};

if (appConfig.database.authToken) {
  clientOptions.authToken = appConfig.database.authToken;
}

export const db = createClient(clientOptions);
