import express, { Request, Response } from "express";
import { Db } from "mongodb";
import { app } from "..";
import { HttpStatusCode } from "../shared/http-status-codes";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  return db
    .collection("weights")
    .find()
    .toArray()
    .then((results) => {
      console.log(results);
      res.send(results).status(HttpStatusCode.OK);
      return;
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");

  console.log(req.body);
  const { weight } = req.body;
  return db
    .collection("weights")
    .insertOne({ weight })
    .then((results) => {
      return db
        .collection("weights")
        .findOne({ _id: results.insertedId })
        .then((insertedWeight) => {
          console.log(insertedWeight);
          res.send(insertedWeight).status(HttpStatusCode.CREATED);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
