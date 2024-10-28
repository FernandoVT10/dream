import { API_URL } from "./constants";
import { Mix, Receipt, MixWithReceipt } from "./types";

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
}

export default Api;
