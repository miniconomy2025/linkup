import { Schema, model, Document } from 'mongoose';
import { FollowActivity } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseActivityFields = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Create', 'Follow', 'Like', 'Undo'] },
  actor: { type: String, required: true },
  published: { type: String, default: () => new Date().toISOString() },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type FollowActivityDocument = FollowActivity & Document;

const FollowSchema = new Schema<FollowActivityDocument>({
  ...BaseActivityFields,
  type: { type: String, enum: ['Follow'], required: true },
  object: { type: String, required: true },
}, { timestamps: true, versionKey: false });

FollowSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/activities/follow/${this._id.toString()}`;
  }
  next();
});

export const FollowModel = model<FollowActivityDocument>('Follow', FollowSchema);