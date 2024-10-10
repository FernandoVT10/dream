import { Router } from "express";
import receipts from "./receipts/routes";

const router = Router();

router.use("/receipts", receipts);

export default router;
