import { Receipt, Mix } from "../models";
import { Op, WhereOptions } from "sequelize";
import { MIX_STATUS_LIST, RECEIPT_STATUS_LIST } from "../constants";

import Logger from "../Logger";
import getSearchTokens from "../utils/getSearchTokens";

type ReceiptWithMixes = Receipt & {
  mixes: Mix[];
};

const SUPPORTED_TOKENS = ["folio", "sap", "date", "kind", "status"];

function getFiltersFromSearch(search: string): WhereOptions {
  const filters: WhereOptions = {};

  const tokens = getSearchTokens(search, SUPPORTED_TOKENS);

  for(const key in tokens) {
    let val = tokens[key];

    // add the like symbol to all the fields but date and kind
    if(key !== "date" && key !== "kind" && key !== "status") val += "%";

    filters[key] = {
      [Op.like]: val,
    };
  }

  return filters;
}

type CreateOneData = {
  date: Date;
  folio: string;
  kind: string;
  sap: string;
  description?: string;
  mixes: {
    quantity: string;
    presentation: string;
    numberOfMix?: string;
  }[];
};

type UpdateOneData = {
  date?: Date;
  folio?: string;
  quantity?: string;
  description?: string;
  kind?: string;
  sap?: string;
};

class ReceiptController {
  static async createOne(data: CreateOneData): Promise<Receipt> {
    return await Receipt.create(data, { include: [Mix] });
  }

  static async getAll(): Promise<Receipt[]> {
    return await Receipt.findAll({
      order: [
        ["date", "DESC"],
      ],
    });
  }

  static async deleteOne(id: number): Promise<void> {
    await Receipt.destroy({
      where: { id },
    });
  }

  static async existsWithId(id: number): Promise<boolean> {
    return (await Receipt.count({
      where: { id },
    })) > 0;
  }

  static async updateOne(id: number, data: UpdateOneData): Promise<void> {
    await Receipt.update(data, {
      where: { id },
    });
  }

  static async searchAll(search: string): Promise<Receipt[]> {
    return await Receipt.findAll({
      where: getFiltersFromSearch(search),
      order: [
        ["date", "DESC"],
      ],
    });
  }

  static async updateStatus(id: number): Promise<void> {
    const count = await Mix.count({
      where: {
        receiptId: id,
        status: MIX_STATUS_LIST.pending,
      },
    });

    if(count > 0) return;

    const receipt = await Receipt.findByPk(id);

    // TODO: here we should log this as if this was an error
    if(!receipt) {
      Logger.logError(
        "Receipt is null, it's either a problem of the database or with the validation",
        new Error()
      );
      return;
    }

    receipt.status = RECEIPT_STATUS_LIST.delivered;
    await receipt.save();
  }

  static async getOneWithMixes(id: number): Promise<ReceiptWithMixes | null> {
    return await Receipt.findByPk(id, {
      include: {
        model: Mix,
        as: "mixes",
      }
    });
  }
}

export default ReceiptController;
