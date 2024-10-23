import { Schema, ParamSchema } from "express-validator";
import { RECEIPT_KIND_LIST, RECEIPT_SEARCH_BY_VALUES } from "../constants";
import ReceiptController from "../controllers/ReceiptController";
import Logger from "../Logger";

const INVALID_KIND_MSG = `kind is invalid (supported: ${RECEIPT_KIND_LIST.join(", ")})`;

const createSchema: Schema = {
  date: {
    isDate: { errorMessage: "date is invalid" },
  },
  folio: {
    exists: {
      errorMessage: "folio is required",
      options: { values: "falsy" },
    },
  },
  kind: {
    exists: {
      errorMessage: "kind is required",
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: INVALID_KIND_MSG,
      options: [RECEIPT_KIND_LIST],
    },
  },
  sap: {
    exists: {
      errorMessage: "sap is required",
      options: { values: "falsy" },
    },
    isInt: {
      errorMessage: "sap should only contain numbers",
      options: { gt: 0 },
    },
  },
  description: {
    optional: {
      options: { values: "falsy" },
    },
  },
  mixes: {
    custom: {
      options: (mixes) => {
        if(!Array.isArray(mixes)) throw new Error("mixes should be an array");

        if(mixes.length < 1) throw new Error("there should be at least one mix");

        return true;
      },
    },
  },
  "mixes.*.quantity": {
    exists: {
      errorMessage: "quantity is required",
      options: { values: "falsy" },
    },
  },
  "mixes.*.presentation": {
    exists: {
      errorMessage: "presentation is required",
      options: { values: "falsy" },
    },
  },
  "mixes.*.numberOfMix": {
    optional: {
      options: { values: "falsy" },
    },
    isInt: {
      errorMessage: "numberOfMixes should only contain numbers",
      options: { gt: 0 },
    },
  },
};

const receiptIdValidator: ParamSchema = {
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
        exists = await ReceiptController.existsWithId(id);
      } catch(e) {
        Logger.logError("Error trying to connect with db", e);
        throw new Error("Sever Error");
      }

      if(exists) return true;

      throw new Error(`there is no receipt with id: ${id}`);
    },
  },
};

export const deleteSchema: Schema = { id: receiptIdValidator };

const updateSchema: Schema = {
  id: receiptIdValidator,
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
  kind: {
    optional: {
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: INVALID_KIND_MSG,
      options: [RECEIPT_KIND_LIST],
    },
  },
  sap: {
    optional: {
      options: { values: "falsy" },
    },
    isInt: {
      errorMessage: "sap should only contain numbers",
      options: { gt: 0 },
    },
  },
};

const getMixesSchema: Schema = { id: receiptIdValidator };

export default {
  create: createSchema,
  delete: deleteSchema,
  update: updateSchema,
  getMixes: getMixesSchema,
};
