import { Schema, model, Document } from 'mongoose';
import { InboxItem } from '../types/activitypub';

type InboxItemDoc = InboxItem & Document;

const InboxItemSchema = new Schema<InboxItemDoc>({
  actor:      { type: String, required: true, index: true },
  activity:   { type: String, required: true },
  receivedAt: { type: Date,   default: () => new Date() },
}, { timestamps: true, versionKey: false });

InboxItemSchema.index({ actor: 1, receivedAt: -1 });

export const InboxItemModel = model<InboxItemDoc>('InboxItem', InboxItemSchema); 