import validateSchema from "../middlewares/validateSchema";

import { Router } from "express";
import { createOne, getAll } from "./controller";
import { Schema, matchedData } from "express-validator";
import { createReceiptSchema } from "./validation";

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

export default router;
