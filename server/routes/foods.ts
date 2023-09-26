import express, { Request, Response } from "express";
import { Db, ObjectId } from "mongodb";
import { app } from "..";
import { HttpStatusCode } from "../shared/http-status-codes";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  return db
    .collection("foods")
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

router.get("/:id", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  return db
    .collection("foods")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((results) => {
      console.log("Get by ID:", results);
      res.send(results).status(HttpStatusCode.OK);
      return;
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  const { name, caloriesPer100g, weight, nutriScore, tags, photo } = req.body;
  const newFood = { name, caloriesPer100g, weight, nutriScore, tags, photo };
  console.log(req.body);
  return db
    .collection("foods")
    .insertOne({
      ...newFood,
      createdAt: new Date(),
    })
    .then((results) => {
      return db
        .collection("foods")
        .findOne({ _id: results.insertedId })
        .then((insertedFood) => {
          console.log(insertedFood);
          res.send(insertedFood).status(HttpStatusCode.CREATED);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

router.put("/:id", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  const { name, caloriesPer100g, weight, nutriScore, tags, photo } = req.body;
  const newFood = { name, caloriesPer100g, weight, nutriScore, tags, photo };
  console.log(req.body);
  return db
    .collection("foods")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: newFood })
    .then((results) => {
      return db
        .collection("foods")
        .findOne({ _id: new ObjectId(req.params.id) })
        .then((insertedFood) => {
          console.log(insertedFood);
          res.send(insertedFood).status(HttpStatusCode.OK);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

router.delete("/:id", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  console.log(req.body);
  return db
    .collection("foods")
    .deleteOne({
      _id: new ObjectId(req.params.id),
    })
    .then((results) => {
      console.log("Prawidłowo usunięto");
      res.sendStatus(HttpStatusCode.NO_CONTENT);
      return;
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
