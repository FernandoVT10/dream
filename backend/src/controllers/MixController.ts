import { Mix } from "../models";
import { MIX_STATUS_LIST } from "../constants";

import ReceiptController from "./ReceiptController";

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

    // TODO: here we should log this as if this was an error
    if(!mix) return;

    mix.status = MIX_STATUS_LIST.delivered;
    mix.deliveredDate = getTodayDate();
    await mix.save();

    await ReceiptController.updateStatus(mix.receiptId);
  }
}

export default MixController;
