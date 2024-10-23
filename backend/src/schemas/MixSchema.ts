import { ParamSchema, Schema } from "express-validator";
import { MIX_STATUS_LIST } from "../constants";

import MixController from "../controllers/MixController";
import Logger from "../Logger";

const mixIdValidator: ParamSchema = {
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
};

const markAsDeliveredSchema: Schema = { id: mixIdValidator };

export default {
  markAsDelivered: markAsDeliveredSchema,
};
