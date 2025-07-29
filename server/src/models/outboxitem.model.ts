import { Schema, model, Document } from 'mongoose';
import { OutboxItem } from '../types/activitypub';

type OutboxItemDoc = OutboxItem & Document;

const OutboxItemSchema = new Schema<OutboxItemDoc>({
  actor:    { type: String, required: true, index: true },
  activity: { type: String, required: true, unique: true },
  createdAt:{ type: Date,   default: () => new Date() },
});

OutboxItemSchema.index({ actor: 1, createdAt: -1 });

export const OutboxItemModel = model<OutboxItemDoc>(
  'OutboxItem',
  OutboxItemSchema
); 