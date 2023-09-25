import express from "express";
import { MongoClient } from "mongodb";
import "./loadEnvironment";
import posts from "./routes/posts";
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

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

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

export { app };
