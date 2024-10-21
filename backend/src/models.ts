import {
  Table,
  Column,
  Model,
  HasMany,
  BelongsTo,
  DataType,
  ForeignKey,
  Default,
  AllowNull
} from "sequelize-typescript";

@Table
export class Receipt extends Model {
  @Column
  date: string;
  @Column
  folio: string;
  @Column
  description: string;
  @Column
  kind: string;
  @Column
  sap: string;
  @Default("pending")
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
  @Default("pending")
  @Column
  status: string;
  @AllowNull(true)
  @Column
  deliveredDate: string;

  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;
  @BelongsTo(() => Receipt)
  receipt: Receipt;
}
