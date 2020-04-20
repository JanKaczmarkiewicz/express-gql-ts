import createDatabaseConnection from "./db/connect";
import * as dotenv from "dotenv";
import path = require("path");
import createServer from "./server/createServer";

dotenv.config({
  path: path.resolve(__dirname, `../config/.env.${process.env.ENVIRONMENT}`),
});

createDatabaseConnection()
  .then(() => createServer().listen(process.env.PORT))
  .then(({ port }) => console.log(port));
