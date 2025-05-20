import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true , unique: true})
  email: string;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop({ type: [String], default: [] })
  purchaseHistory: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);