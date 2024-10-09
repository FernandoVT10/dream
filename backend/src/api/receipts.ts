import validateSchema from "../middlewares/validateSchema";

import { Router } from "express";
import { createOne, getAll } from "../controllers/ReceiptController";
import { Schema, matchedData } from "express-validator";

const router = Router();

const createReceiptSchema: Schema = {
  date: {
    isDate: { errorMessage: "date is invalid" },
  },
  folio: {
    exists: {
      errorMessage: "folio is required",
      options: { values: "falsy" },
    },
  },
  quantity: {
    exists: {
      errorMessage: "quantity is required",
      options: { values: "falsy" },
    },
  },
  description: {
    optional: {
      options: { values: "falsy" },
    },
  },
};

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

export default router;
