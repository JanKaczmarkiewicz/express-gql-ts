import createDatabaseConnection from "./db/connect";
import * as dotenv from "dotenv";
import createServer from "./createServer";
import path = require("path");

dotenv.config({
  path: path.resolve(__dirname, `../config/.env.${process.env.ENVIRONMENT}`),
});

createDatabaseConnection().then(createServer);
