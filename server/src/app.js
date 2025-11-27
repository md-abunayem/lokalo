import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import addressRouter from "./routes/address.routes.js"

//routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);

//http://localhost:8000/api/v1/users/register
export default app;
