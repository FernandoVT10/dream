import sequelize from "./sequelize";
import app from "./app";

import { Receipt } from "./models";

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch {
    console.error("Error trying to connect to the database");
  }

  const tag = "\x1b[34m[SERVER]\x1b[0m";
  const message = "\x1b[36mServer running on port: [3000]\x1b[0m";
  
  app.listen(3000, () => console.log(`${tag} ${message}`));
}

main();
