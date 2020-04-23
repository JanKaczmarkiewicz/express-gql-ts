import * as mongoose from "mongoose";

const createDatabaseConnection = (options: mongoose.ConnectionOptions = {}) => {
  if (mongoose.connection.readyState == 1) return mongoose;

  mongoose.connection
    .on("error", console.error)
    .on("disconnected", () => createDatabaseConnection());

  return mongoose
    .connect(
      `mongodb://${process.env.DB_ADDRESS}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ...options,
      }
    )
    .catch((err) => {
      throw new Error(err);
    });
};

export default createDatabaseConnection;
