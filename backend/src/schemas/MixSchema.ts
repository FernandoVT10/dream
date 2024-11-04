import { Schema } from "express-validator";
import { MIX_STATUS_LIST } from "../constants";

import MixController from "../controllers/MixController";
import Logger from "../Logger";

// TODO: make a better date validation, this is garbage
function isDateValid(value: string): boolean {
  return /\d{4}(-\d{2}){2}/.test(value);
}

const MIX_STATUS_ARRAY = Object.values(MIX_STATUS_LIST);

const INVALID_STATUS_MSG = `status is invalid (supported: ${MIX_STATUS_ARRAY.join(", ")})`;

const markAsDeliveredSchema: Schema = {
  id: {
    in: "params",
    isInt: {
      errorMessage: "id should be a number greater than 0",
      options: { gt: 0 },
      bail: true,
    },
    custom: {
      options: async (value) => {
        const id = parseInt(value);

        let mixStatus: null | string;

        try {
          mixStatus = await MixController.getMixStatus(id);
        } catch(e) {
          Logger.logError("Error trying to connect with db", e);
          throw new Error("Sever Error");
        }


        if(mixStatus === null) {
          throw new Error("there is no a mix with this id");
        }

        if(mixStatus === MIX_STATUS_LIST.delivered) {
          throw new Error("the status of the mix is already marked as delivered");
        }

        return true;
      },
    },
  },
};

const updateSchema: Schema = {
  id: {
    in: "params",
    isInt: {
      errorMessage: "id should be a number greater than 0",
      options: { gt: 0 },
      bail: true,
    },
    custom: {
      options: async (value) => {
        let exists: boolean;

        try {
          const id = parseInt(value);
          exists = await MixController.existsWithId(id);
        } catch(e) {
          Logger.logError("Error trying to connect with db", e);
          throw new Error("Sever Error");
        }

        if(exists)
          return true;
        else
          throw new Error("there is no a mix with this id");
      },
    },
  },
  quantity: {
    optional: {
      options: { values: "falsy" },
    },

  },
  presentation: {
    optional: {
      options: { values: "falsy" },
    },
  },
  status: {
    optional: {
      options: { values: "falsy" },
    },
    isIn: {
      errorMessage: INVALID_STATUS_MSG,
      options: [MIX_STATUS_ARRAY],
    },
  },
  deliveredDate: {
    custom: {
      options: (value, { req }) => {
        // TODO: validate this is a valid date
        if(req.body.status !== MIX_STATUS_LIST.delivered) {
          if(value)
            throw new Error("delivery date cannot be set if the \"status\" is not equal to delivered");

          return true;
        }

        if(!value)
          throw new Error("deliveredDate is required when setting \"status\" as delivered");

        if(!isDateValid(value))
          throw new Error("deliveredDate is not a valid date");

        return true;
      },
    },
  },
};

export default {
  markAsDelivered: markAsDeliveredSchema,
  update: updateSchema,
};
