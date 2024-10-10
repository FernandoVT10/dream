import express from "express";
import bodyParser from "body-parser";
import apiRoutes from "./apiRoutes";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRoutes);

export default app;

