import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import nocache from "nocache";
import config from "./config.js";

import dotenv, { config } from "dotenv";
dotenv.config();

const app = express();

app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());
app.use(nocache());
app.use((req, res, next) => {
    console.log(req.url, req.method);
    next();
})
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*");
    },
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.server.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
