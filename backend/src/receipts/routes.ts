import validateSchema from "../middlewares/validateSchema";

import { Router } from "express";
import { createOne, getAll, deleteOne } from "./controller";
import { Schema, matchedData } from "express-validator";
import { createReceiptSchema, deleteReceiptSchema } from "./validation";

const router = Router();

router.post("/", validateSchema(createReceiptSchema), async (req, res, next) => {
  try {
    await createOne(matchedData(req));
    
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

router.get("/", async (_, res, next) => {
  try {
    const receipts = await getAll(); 
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

export default router;
