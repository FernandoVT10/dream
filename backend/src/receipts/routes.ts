import validateSchema from "../middlewares/validateSchema";

import { Router } from "express";
import { Receipt } from "../models";
import { createOne, getAll, deleteOne, updateOne, searchAll } from "./controller";
import { Schema, matchedData } from "express-validator";
import {
  createReceiptSchema,
  deleteReceiptSchema,
  updateReceiptSchema,
} from "./validation";

const router = Router();

router.post("/", validateSchema(createReceiptSchema), async (req, res, next) => {
  try {
    await createOne(matchedData(req));
    
    res.sendStatus(200);
  } catch(e) {
    console.error(e);
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search;

    let receipts: Receipt[];
    if(search) {
      receipts = await searchAll(search.toString()); 
    } else {
      receipts = await getAll(); 
    }

    res.json({ receipts });
  } catch(e) {
    next(e);
  }
});

router.delete("/:id", validateSchema(deleteReceiptSchema), async (req, res, next) => {
  try {
    const id = parseInt(matchedData(req).id);
    await deleteOne(id);
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

router.put("/:id", validateSchema(updateReceiptSchema), async (req, res, next) => {
  try {
    const data = matchedData(req);

    const id = parseInt(data.id);

    await updateOne(id, {
      date: data.date,
      folio: data.folio,
      quantity: data.quantity,
      kind: data.kind,
      sap: data.sap,
      description: data.description,
    });
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

export default router;
