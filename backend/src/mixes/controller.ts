import { Mix, Receipt } from "../models";
import { MIX_STATUS_LIST, RECEIPT_STATUS_LIST } from "../constants";

function getTodayDate(): string {
  // the date should be formatted to yyyy-mm-dd
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function updateReceiptStatus(receiptId: number): Promise<void> {
  const count = await Mix.count({
    where: {
      receiptId,
      status: MIX_STATUS_LIST.pending,
    },
  });

  if(count > 0) return;

  const receipt = await Receipt.findByPk(receiptId);

  // TODO: here we should log this as if this was an error
  if(!receipt) return;

  receipt.status = RECEIPT_STATUS_LIST.delivered;
  await receipt.save();
}

export async function markAsDelivered(id: number): Promise<void> {
  const mix = await Mix.findByPk(id);

  // TODO: here we should log this as if this was an error
  if(!mix) return;

  mix.status = MIX_STATUS_LIST.delivered;
  mix.deliveredDate = getTodayDate();
  await mix.save();

  await updateReceiptStatus(mix.receiptId);
}

export async function getMixStatus(id: number): Promise<string | null> {
  const mix = await Mix.findByPk(id);
  if(!mix) return null;
  return mix.status;
}
