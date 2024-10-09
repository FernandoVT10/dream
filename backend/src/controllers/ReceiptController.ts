import { Receipt } from "../models";

type ReceiptStatus = "pending" | "part-delivered" | "delivered";

const RECEIPT_STATUS = {
  pending: "pending",
  partDelivered: "part-delivered",
  delivered: "delivered",
};

type CreateOneData = {
  date: Date;
  folio: string;
  quantity: string;
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
