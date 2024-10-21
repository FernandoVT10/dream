import { ParamSchema, Schema } from "express-validator";

import { existsWithId } from "./controller";

const idValidator: ParamSchema = {
  in: "params",
  isInt: {
    errorMessage: "id should be a number greater than 0",
    options: { gt: 0 },
    bail: true,
  },
  custom: {
    options: async (value) => {
      const id = parseInt(value);

      let exists: boolean;

      try {
        exists = await existsWithId(id);
      } catch(e) {
        // TODO: implement better error logging
        console.error("[SERVER] Error trying to connect with db", e);
        throw new Error("Sever Error");
      }

      if(exists) return true;

      throw new Error(`there is no mix with id: ${id}`);
    },
  },
};

export const markAsDeliveredSchema: Schema = {
  id: idValidator,
};
