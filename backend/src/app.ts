import express from "express";
import bodyParser from "body-parser";
import receipts from "./routes/receipts";
import mixes from "./routes/mixes";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/receipts", receipts);
app.use("/api/mixes", mixes);

export default app;

