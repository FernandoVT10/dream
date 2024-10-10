import express from "express";
import bodyParser from "body-parser";
import receipts from "./receipts/routes";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/receipts", receipts);

export default app;

