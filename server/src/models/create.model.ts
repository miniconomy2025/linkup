import { Schema, model, Document } from 'mongoose';
import { CreateActivity } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseActivityFields = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Create', 'Follow', 'Like', 'Undo'] },
  actor: { type: String, required: true },
  published: { type: Date, required: false },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type CreateActivityDocument = CreateActivity & Document;

const CreateSchema = new Schema<CreateActivityDocument>({
  ...BaseActivityFields,
  type: { type: String, enum: ['Create'], required: true },
  object: { type: Schema.Types.Mixed, required: true },
}, { versionKey: false });

CreateSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/activities/create/${this._id.toString()}`;
  }
  next();
});

export const CreateModel = model<CreateActivityDocument>('Create', CreateSchema);