import express, { Request, Response } from "express";
import { Db } from "mongodb";
import { app } from "..";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const db: Db = app.get("db");
  return db
    .collection("foods")
    .find()
    .toArray()
    .then((results) => {
      console.log("tesotry komentarz");
      res.send(results).status(200);
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
          res.send(insertedFood).status(201);
        });
    })
    .catch((error) => {
      console.error(error);
    });
});

export default router;
