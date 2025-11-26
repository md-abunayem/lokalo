import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
  try {
    const connection = await mongoose
    .connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\nMONGODB connected !! DB HOST ${connection.connection.host}`)
  } catch (error) {
    console.log("MONGODB connecteion error ", error);
    process.exit(1);
  }
};

export default connectDB;