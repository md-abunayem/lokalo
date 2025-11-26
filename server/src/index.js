import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./db/index.js";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`The server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connention failed !!! ", error);
  });
