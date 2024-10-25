import { WhereOptions } from "sequelize";
import { Mix } from "../models";
import { MIX_STATUS_LIST } from "../constants";

import Logger from "../Logger";
import ReceiptController from "./ReceiptController";
import getSearchTokens from "../utils/getSearchTokens";
const SUPPORTED_TOKENS = ["status", "deliveredDate"];

function getTodayDate(): string {
  // the date should be formatted to yyyy-mm-dd
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getFiltersFromSearch(search: string): WhereOptions {
  const filters: WhereOptions = {};

  const tokens = getSearchTokens(search, SUPPORTED_TOKENS);
  for(const key in tokens) {
    filters[key] = tokens[key];
  }

  return filters;
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
    return await Mix.findAll({
      where: getFiltersFromSearch(search),
    });
  }
}

export default MixController;
