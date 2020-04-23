import createDatabaseConnection from "./db/connect";
import createServer from "./server/createServer";
import loadEnv from "./utils/loadEnv";

loadEnv();

(async () => {
  await createDatabaseConnection();
  await createServer().listen(process.env.PORT);
  console.log(`Server started! App is listenig in port ${process.env.PORT}.`);
})();
