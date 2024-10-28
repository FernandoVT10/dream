import { WhereOptions, Op } from "sequelize";
import { Mix, Receipt } from "../models";
import { MIX_STATUS_LIST } from "../constants";

import Logger from "../Logger";
import ReceiptController from "./ReceiptController";
import getSearchTokens from "../utils/getSearchTokens";

const SUPPORTED_TOKENS = ["status", "deliveredDate", "folio", "sap", "kind"];

function getTodayDate(): string {
  // the date should be formatted to yyyy-mm-dd
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

class MixController {
  static async getAllByReceiptId(receiptId: number): Promise<Mix[]> {
    return await Mix.findAll({
      where: { receiptId },
    });
  }

  static async getMixStatus(id: number): Promise<string | null> {
    const mix = await Mix.findByPk(id);
    if(!mix) return null;
    return mix.status;
  }

  static async markAsDelivered(id: number): Promise<void> {
    const mix = await Mix.findByPk(id);

    if(!mix) {
      Logger.logError(
        "Mix is null, it's either a problem of the database or with the validation",
        new Error()
      );
      return;
    }

    mix.status = MIX_STATUS_LIST.delivered;
    mix.deliveredDate = getTodayDate();
    await mix.save();

    await ReceiptController.updateStatus(mix.receiptId);
  }

  static async searchAll(search: string): Promise<Mix[]> {
    const tokens = getSearchTokens(search, SUPPORTED_TOKENS);

    const filters: WhereOptions = {};

    // these tokens refer to attributes of the receipt
    { 
      if(tokens.folio) {
        filters["$receipt.folio$"] = {
          [Op.like]: `${tokens.folio}%`
        };
      }

      if(tokens.sap) {
        filters["$receipt.sap$"] = {
          [Op.like]: `${tokens.sap}%`
        };
      }

      if(tokens.kind)
        filters["$receipt.kind$"] = tokens.kind;
    }

    // these refer to attributes of the mix itself
    {
      if(tokens.status)
        filters.status = tokens.status;

      if(tokens.deliveredDate)
        filters.deliveredDate = tokens.deliveredDate;
    }

    return await Mix.findAll({
      where: filters,
      include: [
        {
          model: Receipt,
          as: "receipt",
        }
      ],
    });
  }
}

export default MixController;
