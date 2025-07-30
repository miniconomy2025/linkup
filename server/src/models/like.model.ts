import { Schema, model, Document } from 'mongoose';
import { LikeActivity } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseActivityFields = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Create', 'Follow', 'Like', 'Undo'] },
  actor: { type: String, required: true },
  published: { type: Date, required: false },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type LikeActivityDocument = LikeActivity & Document;

const LikeSchema = new Schema<LikeActivityDocument>({
  ...BaseActivityFields,
  type: { type: String, enum: ['Like'], required: true },
  object: { type: String, required: true },
}, { versionKey: false });

LikeSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/activities/like/${this._id.toString()}`;
  }
  next();
});

export const LikeModel = model<LikeActivityDocument>('Like', LikeSchema);
