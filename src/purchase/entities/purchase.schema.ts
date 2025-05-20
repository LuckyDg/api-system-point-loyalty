import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type PurchaseDocument = Purchase & Document;

@Schema()
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  productIds: Types.ObjectId[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  pointsEarned: number;

  @Prop({ default: Date.now })
  purchaseDate: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
