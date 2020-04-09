import * as mongoose from "mongoose";

const connectToDatabase = () =>
  mongoose
    .connect(
      `mongodb://${process.env.DB_ADDRESS}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .catch((err) => {
      throw new Error(err);
    });

export default connectToDatabase;
