import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST']
}));
app.use(xss());
app.use(hpp());
app.use(mongoSanitize());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
