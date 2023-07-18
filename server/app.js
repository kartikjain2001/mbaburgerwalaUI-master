import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { connectPassport } from "./utils/Provider.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

export default app;
dotenv.config({
  path: "./config/config.env"
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  urlencoded({
    extended: true
  })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

connectPassport();

//Importing route

import userRoute from "./routes/user.js";
import orderRoute from "./routes/user.js";

app.use("./api/vi", userRoute);
app.use("./api/vi", orderRoute);

//Using Error Middleware
app.use(errorMiddleware);
