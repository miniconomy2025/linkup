import { Schema, model, Document } from 'mongoose';
import { UndoActivity } from '../types/activitypub';

const BaseActivityFields = {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['Create', 'Follow', 'Like', 'Undo'] },
    actor: { type: String, required: true },
    published: { type: Date, required: false },
    to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type UndoActivityDocument = UndoActivity & Document;

const UndoSchema = new Schema<UndoActivityDocument>({
  ...BaseActivityFields,
  type: { type: String, enum: ['Undo'], required: true },
  object: { type: Schema.Types.Mixed, required: true },
} as const);

export const UndoModel = model<UndoActivityDocument>('Undo', UndoSchema);
