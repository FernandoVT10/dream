import validateSchema from "../middlewares/validateSchema";

import { Router } from "express";
import { Receipt } from "../models";
import { matchedData } from "express-validator";

import ReceiptSchema from "../schemas/ReceiptSchema";
import ReceiptController from "../controllers/ReceiptController";
import MixController from "../controllers/MixController";

const router = Router();

router.post("/", validateSchema(ReceiptSchema.create), async (req, res, next) => {
  try {
    const receipt = await ReceiptController.createOne(matchedData(req));
    
    res.json({ receipt });
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
      receipts = await ReceiptController.searchAll(search.toString()); 
    } else {
      receipts = await ReceiptController.getAll(); 
    }

    res.json({ receipts });
  } catch(e) {
    next(e);
  }
});

router.delete("/:id", validateSchema(ReceiptSchema.delete), async (req, res, next) => {
  try {
    const id = parseInt(matchedData(req).id);
    await ReceiptController.deleteOne(id);
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

router.put("/:id", validateSchema(ReceiptSchema.update), async (req, res, next) => {
  try {
    const data = matchedData(req);

    const id = parseInt(data.id);

    await ReceiptController.updateOne(id, {
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

router.get("/:id/mixes", validateSchema(ReceiptSchema.getMixes), async (req, res, next) => {
  try {
    const data = matchedData(req);
    const id = parseInt(data.id);

    const mixes = await MixController.getAllByReceiptId(id);
    res.json({ mixes });
  } catch(e) {
    next(e);
  }
});

export default router;
