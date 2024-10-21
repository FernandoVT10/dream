import { Router } from "express";
import { matchedData } from "express-validator";

import { markAsDelivered } from "./controller";

const router = Router();

router.put("/:id/markAsDelivered", async (req, res, next) => {
  try {
    const id = parseInt(matchedData(req).id);
    await markAsDelivered(id);
    res.sendStatus(200);
  } catch(e) {
    next(e);
  }
});

export default router;
