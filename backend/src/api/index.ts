import { Router } from "express";
import receipts from "./receipts";

const router = Router();

router.use("/receipts", receipts);

export default router;
