export type Receipt = {
  id: number;
  date: string;
  folio: string;
  sap: string;
  kind: string;
  description?: string;
  status: string;
};

export type Mix = {
  id: number;
  quantity: string;
  presentation: string;
  numberOfMix: string;
  status: string;
  deliveredDate: string;
};

export type MixWithReceipt = Mix & {
  receipt: Receipt;
};

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
