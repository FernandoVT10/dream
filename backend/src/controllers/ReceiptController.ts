import { Receipt, Mix } from "../models";
import { Op, WhereOptions } from "sequelize";
import { MIX_STATUS_LIST, RECEIPT_STATUS_LIST } from "../constants";

import Logger from "../Logger";

const SUPPORTED_KEYS = ["folio", "sap", "date", "kind", "status"];

function getSearchTokens(search: string): Record<string, string> {
  const tokens: Record<string, string> = {};

  let key = "";
  let val = "";
  let state: "key" | "val" | "noState" = "noState";

  for(let i = 0; i < search.length; i++) {
    const c = search.charAt(i);

    switch(state) {
      case "key": {
        if(c === ":") {
          state = "val";
        } else {
          key += c;
        }
      } break;
      case "val": {
        // if either we encounter a space or is the last character
        // we add the token

        if(c !== ";") val += c;

        if(c === ";" || i === search.length - 1) {
          // only add supported keys to the tokens
          if(SUPPORTED_KEYS.includes(key)) {
            // TODO: validate that date is a valid date
            tokens[key] = val;
          }

          key = "";
          val = "";
          state = "noState";
        }
      } break;
      case "noState": {
        // we skip all spaces before of entering the getting key "phase"
        if(c !== " ") {
          key += c;
          state = "key";
        }
      } break;
    }
  }

  return tokens;
}


function getFiltersFromSearch(search: string): WhereOptions {
  const filters: WhereOptions = {};

  const tokens = getSearchTokens(search);

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
        ["createdAt", "DESC"],
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
        ["createdAt", "DESC"],
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
}

export default ReceiptController;
