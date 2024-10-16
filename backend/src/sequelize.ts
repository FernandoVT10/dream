import { Receipt, Mix } from "./models";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
});

sequelize.addModels([Receipt, Mix]);

export default sequelize;
