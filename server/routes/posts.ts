import express, { Request, Response } from "express";
import { Db } from "mongodb";
import { app } from "..";
import { HttpStatusCode } from "../shared/http-status-codes";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  return db
    .collection("users")
    .find()
    .toArray()
    .then((results) => {
      console.log(results);
      res.send(results).status(HttpStatusCode.OK);
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
