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

import { MIX_STATUS_LIST } from "./constants";

@Table
export class Receipt extends Model {
  @Column(DataType.DATEONLY)
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
  @Default(MIX_STATUS_LIST.pending)
  @Column
  status: string;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  deliveredDate: string;

  @ForeignKey(() => Receipt)
  @Column
  receiptId: number;
  @BelongsTo(() => Receipt)
  receipt: Receipt;
}
