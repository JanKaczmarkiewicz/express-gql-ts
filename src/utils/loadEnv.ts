import * as dotenv from "dotenv";
import path = require("path");

export default () => {
  dotenv.config({
    path: path.resolve(
      __dirname,
      `../../config/.env.${process.env.ENVIRONMENT}`
    ),
  });
};
