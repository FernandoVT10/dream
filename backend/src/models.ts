import { Table, Column, Model, HasMany, BelongsTo, DataType, ForeignKey } from "sequelize-typescript";

@Table
export class Receipt extends Model {
  @Column
  date: Date;
  @Column
  folio: string;
  @Column
  quantity: string;
  @Column
  description: string;
  @Column
  kind: string;
  @Column
  sap: string;
  @Column
  status: string;

  @HasMany(() => ReceiptUnit)
  units: ReceiptUnit[];
}

@Table
export class ReceiptUnit extends Model {
  @Column(DataType.JSON)
  presentation: string;
  @Column
  status: string;
  @Column
  deliveryDate: Date;
  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;
  @BelongsTo(() => Receipt)
  receipt: Receipt;
}
