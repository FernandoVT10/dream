import { Receipt, ReceiptUnit } from "./models";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

sequelize.addModels([ReceiptUnit, Receipt]);

export default sequelize;
