import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: string;

  @Prop({ required: true })
  pointsUsed: number;

  @Prop({ required: true })
  rewardDescription: string;

  @Prop({ default: Date.now })
  rewardDate: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
