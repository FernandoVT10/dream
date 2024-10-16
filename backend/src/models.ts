import { Table, Column, Model, HasMany, BelongsTo, DataType, ForeignKey } from "sequelize-typescript";

@Table
export class Receipt extends Model {
  @Column
  date: Date;
  @Column
  folio: string;
  @Column
  description: string;
  @Column
  kind: string;
  @Column
  sap: string;
  @Column
  status: string;

  @HasMany(() => Mix)
  mixes: Mix[];
}

@Table
export class Mix extends Model {
  @Column
  quantity: string;
  @Column
  presentation: string;
  @Column
  numberOfMix: string;
  @Column
  status: string;
  @Column
  deliveredDate: Date;

  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;
  @BelongsTo(() => Receipt)
  receipt: Receipt;
}
