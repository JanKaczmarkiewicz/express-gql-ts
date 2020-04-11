import createDatabaseConnection from "../db/connect";
import * as mongoose from "mongoose";
import path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, `../../config/.env.test`),
});

test("Drop db", async () => {
  await new Promise((resolve) => {
    createDatabaseConnection();
    mongoose.connection.on("open", async () => {
      (await mongoose.connection.db.collections()).forEach(
        async (collection) => await collection.drop()
      );
      expect(mongoose.connection.db.collections()).resolves.toStrictEqual([]);
      resolve();
    });
  });
});
