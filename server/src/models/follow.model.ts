import { Schema, model, Document } from 'mongoose';
import { FollowActivity } from '../types/activitypub';

const BaseActivityFields = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Create', 'Follow', 'Like', 'Undo'] },
  actor: { type: String, required: true },
  published: { type: Date, required: false },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

const FollowSchema = new Schema<FollowActivity>({
  ...BaseActivityFields,
  type: { type: String, enum: ['Follow'], required: true },
  object: { type: String, required: true },
});

export const FollowModel = model<FollowActivity & Document>('Follow', FollowSchema); 