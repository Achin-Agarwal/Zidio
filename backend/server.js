import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import nocache from "nocache";
import config from "./config/config.js";
import responseHandler from "./middlewares/responseHandler.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectMongo from "./config/db.js";


const app = express();

app.use(helmet());
app.use(hpp());
app.use(nocache());
app.use(responseHandler);
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

connectMongo();

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

app.use('/upload', uploadRoutes);


app.use((err, req, res, next) => {
  console.error("Error encountered:", err);
  res.status(500).send('Something went wrong!');
});

app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
});
