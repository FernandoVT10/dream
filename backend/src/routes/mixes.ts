import { Router } from "express";
import { matchedData } from "express-validator";

import MixController from "../controllers/MixController";
import MixSchema from "../schemas/MixSchema";
import validateSchema from "../middlewares/validateSchema";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const search = req.query.search || "";

    const mixes = await MixController.searchAll(search.toString()); 

    res.json({ mixes });
  } catch(e) {
    next(e);
  }
});

router.put("/:id/markAsDelivered", validateSchema(MixSchema.markAsDelivered), async (req, res, next) => {
  try {
    const id = parseInt(matchedData(req).id);
    await MixController.markAsDelivered(id);
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

router.put("/:id", validateSchema(MixSchema.update), async (req, res, next) => {
  try {
    const data = matchedData(req);

    const mix = await MixController.updateById(data.id, {
      quantity: data.quantity,
      presentation: data.presentation,
      status: data.status,
      deliveredDate: data.deliveredDate || null,
      numberOfMix: data.numberOfMix || null,
    });

    res.json({ mix });
  } catch(e) {
    next(e);
  }
});

export default router;
