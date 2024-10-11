import { existsWithId, KIND_LIST } from "./controller";
import { Schema, ParamSchema } from "express-validator";

export const createReceiptSchema: Schema = {
  date: {
    isDate: { errorMessage: "date is invalid" },
  },
  folio: {
    exists: {
      errorMessage: "folio is required",
      options: { values: "falsy" },
    },
  },
  quantity: {
    exists: {
      errorMessage: "quantity is required",
      options: { values: "falsy" },
    },
  },
  description: {
    optional: {
      options: { values: "falsy" },
    },
  },
  kind: {
    exists: {
      errorMessage: "kind is required",
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: `kind is invalid (supported: ${KIND_LIST.join(", ")})`,
      options: [KIND_LIST],
    },
  },
};

const idValidator: ParamSchema = {
  in: "params",
  isInt: {
    errorMessage: "id should be a number greater than 0",
    options: { gt: 0 },
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

      throw new Error(`there is no receipt with id: ${id}`);
    },
  },
};

export const deleteReceiptSchema: Schema = {
  id: idValidator,
};

export const updateReceiptSchema: Schema = {
  id: idValidator,
  date: {
    isDate: { errorMessage: "date is invalid" },
    optional: {
      options: { values: "falsy" },
    },
  },
  folio: {
    optional: {
      options: { values: "falsy" },
    },
  },
  quantity: {
    optional: {
      options: { values: "falsy" },
    },
  },
  description: {
    optional: {
      options: { values: "falsy" },
    },
  },
};

