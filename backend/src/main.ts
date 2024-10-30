import sequelize from "./sequelize";
import app from "./app";

import Logger from "./Logger";

const PORT = 3001;

async function main() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => Logger.logInfo(`Server running on port: [${PORT}]`));
  } catch(e) {
    Logger.logError("Error trying to connect to the database", e);
  }
}

main();
