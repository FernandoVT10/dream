import { Receipt } from "../models";

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
  quantity: string;
  kind: string;
  sap: string;
  description?: string;
};

export async function createOne(data: CreateOneData): Promise<void> {
  await Receipt.create({
    status: RECEIPT_STATUS.pending,
    ...data,
  });
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
