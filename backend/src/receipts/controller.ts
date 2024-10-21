import { Receipt, Mix } from "../models";

import getFiltersFromSearch from "./getFiltersFromSearch";

type ReceiptStatus = "pending" | "part-delivered" | "delivered";

export const KIND_LIST = ["strawberry", "raspberry", "corn"];

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

export async function createOne(data: CreateOneData): Promise<void> {
  await Receipt.create(data, { include: [Mix] });
}

export async function getAll(): Promise<Receipt[]> {
  return await Receipt.findAll();
}

export async function deleteOne(id: number): Promise<void> {
  await Receipt.destroy({
    where: { id },
  });
}

export async function existsWithId(id: number): Promise<boolean> {
  return (await Receipt.count({
    where: { id },
  })) > 0;
}

type UpdateOneData = {
  date?: Date;
  folio?: string;
  quantity?: string;
  description?: string;
  kind?: string;
  sap?: string;
};
export async function updateOne(id: number, data: UpdateOneData): Promise<void> {
  await Receipt.update(data, {
    where: { id },
  });
}

export async function searchAll(search: string): Promise<Receipt[]> {
  return await Receipt.findAll({
    where: getFiltersFromSearch(search),
  });
}

export async function getAllMixesFromId(receiptId: number): Promise<Mix[]> {
  return await Mix.findAll({
    where: { receiptId },
  });
}
