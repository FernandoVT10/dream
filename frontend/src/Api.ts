import { API_URL } from "./constants";
import { Mix, Receipt, MixWithReceipt, ReceiptWithMixes } from "./types";

export type CreateReceiptData = {
  date: string;
  kind: string;
  folio: string;
  sap: string;
  mixes: {
    quantity: string;
    presentation: string;
    numberOfMix?: string;
  }[];
};

type UpdateReceiptData = {
  date: string;
  kind: string;
  folio: string;
  sap: string;
};

type UpdateMixData = {
  quantity: string;
  presentation: string;
  status: string;
  deliveredDate: string | null;
  numberOfMix: string | null;
};

class Api {
  static async getMixes(search?: string): Promise<MixWithReceipt[]> {
    let query = "";
    if(search) query = `?search=${search}`;

    const res = await fetch(`${API_URL}/mixes${query}`);
    const json = await res.json();
    return json.mixes;
  }

  static async getMixesByReceiptId(receiptId: number): Promise<Mix[]> {
    const res = await fetch(`${API_URL}/receipts/${receiptId}/mixes`);
    const json = await res.json();
    return json.mixes;
  }

  static async markMixAsDelivered(mixId: number): Promise<boolean> {
    const res = await fetch(`${API_URL}/mixes/${mixId}/markAsDelivered`, {
      method: "PUT",
    });
    return res.status === 200;
  }

  static async updateMix(mixId: number, data: UpdateMixData): Promise<Mix> {
    const res = await fetch(`${API_URL}/mixes/${mixId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json.mix;
  }

  static async deleteReceipt(receiptId: number): Promise<boolean> {
    const res = await fetch(`${API_URL}/receipts/${receiptId}`, {
      method: "DELETE",
    });
    return res.status === 200;
  }

  static async getReceipts(search?: string): Promise<Receipt[]> {
    let query = "";
    if(search) query = `?search=${search}`;

    const res = await fetch(`${API_URL}/receipts${query}`);
    const json = await res.json();
    return json.receipts;
  }

  static async createReceipt(data: CreateReceiptData): Promise<Receipt | null> {
    const res = await fetch(`${API_URL}/receipts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if(res.status === 200) {
      const json = await res.json();
      return json.receipt;
    }

    return null;
  }

  static async getReceiptById(id: number): Promise<ReceiptWithMixes> {
    const res = await fetch(`${API_URL}/receipts/${id}`);
    const json = await res.json();
    return json.receipt;
  }

  static async updateReceipt(receiptId: number, data: UpdateReceiptData): Promise<boolean> {
    const res = await fetch(`${API_URL}/receipts/${receiptId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res.status === 200;
  }
}

export default Api;
