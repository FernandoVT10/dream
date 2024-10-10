import { Schema } from "express-validator";

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
};
