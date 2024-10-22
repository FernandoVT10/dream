import { Router } from "express";
import { matchedData } from "express-validator";

import MixController from "../controllers/MixController";
import MixSchema from "../schemas/MixSchema";
import validateSchema from "../middlewares/validateSchema";

const router = Router();

router.put("/:id/markAsDelivered", validateSchema(MixSchema.markAsDelivered), async (req, res, next) => {
  try {
    const id = parseInt(matchedData(req).id);
    await MixController.markAsDelivered(id);
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

export default router;
