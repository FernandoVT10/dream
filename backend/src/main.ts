import sequelize from "./sequelize";
import app from "./app";

import { Receipt } from "./models";

const PORT = 3001;

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch {
    console.error("Error trying to connect to the database");
  }

  const tag = "\x1b[34m[SERVER]\x1b[0m";
  const message = `\x1b[36mServer running on port: [${PORT}]\x1b[0m`;
  
  app.listen(PORT, () => console.log(`${tag} ${message}`));
}

main();
