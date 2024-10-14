import { existsWithId, KIND_LIST } from "./controller";
import { Schema, ParamSchema } from "express-validator";

const SEARCH_BY_VALUES = ["folio", "sap", "date"];
const INVALID_KIND_MSG = `kind is invalid (supported: ${KIND_LIST.join(", ")})`;

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
  kind: {
    exists: {
      errorMessage: "kind is required",
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: INVALID_KIND_MSG,
      options: [KIND_LIST],
    },
  },
  // TODO: SAP should only accept numbers
  sap: {
    exists: {
      errorMessage: "sap is required",
      options: { values: "falsy" },
    },
  },
  description: {
    optional: {
      options: { values: "falsy" },
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
  kind: {
    optional: {
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: INVALID_KIND_MSG,
      options: [KIND_LIST],
    },
  },
  sap: {
    optional: {
      options: { values: "falsy" },
    },
  },
};

export const getReceiptsSchema: Schema = {
  searchBy: {
    custom: {
      options: (searchBy, { req }) => {
        if(req.query?.search) {
          if(!searchBy) throw new Error("searchBy is required");
          
          if(!SEARCH_BY_VALUES.includes(searchBy))
            throw new Error(`searchBy is invalid (accepted values: ${SEARCH_BY_VALUES.join(", ")})`);
        }

        return true;
      },
    },
  },
  search: {
    custom: {
      options: (search, { req }) => {
        if(!req.query?.searchBy) return true;

        // TODO: validate for date and sap
        const searchBy = req.query.searchBy;
        if(!search) throw new Error("search is required");

        return true;
      },
    },
  },
};
