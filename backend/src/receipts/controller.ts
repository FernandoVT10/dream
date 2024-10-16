import { Receipt, Mix } from "../models";

import getFiltersFromSearch from "./getFiltersFromSearch";

type ReceiptStatus = "pending" | "part-delivered" | "delivered";

const RECEIPT_STATUS = {
  pending: "pending",
  partDelivered: "part-delivered",
  delivered: "delivered",
};

export const KIND_LIST = ["straw", "rasp", "corn"];

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
