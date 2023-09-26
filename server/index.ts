import express from "express";
import fs from "fs";
import { MongoClient } from "mongodb";
import morgan from "morgan";
import path from "path";
import "./loadEnvironment";
import foods from "./routes/foods";
import posts from "./routes/posts";
import weights from "./routes/weights";
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :date[web] :http-version",
    { stream: accessLogStream }
  )
);

const connectionString = process.env.MONGODB_URI || "";

if (!connectionString) {
  console.error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
  process.exit(1);
}

MongoClient.connect(connectionString, {})
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db("cluster0");
    app.set("db", db);
    app.use("/api/posts", posts);
    app.use("/api/weights", weights);
    app.use("/api/foods", foods);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

export { app };
