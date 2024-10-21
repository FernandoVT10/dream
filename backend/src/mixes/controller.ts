import { Mix } from "../models";
import { MIX_STATUS_LIST } from "../constants";

function getTodayDate(): string {
  // the date should be formatted to yyyy-mm-dd
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function markAsDelivered(id: number): Promise<void> {
  const mix = await Mix.findByPk(id);
  if(!mix) return;

  mix.status = MIX_STATUS_LIST.delivered;
  mix.deliveredDate = getTodayDate();
  await mix.save();
}
