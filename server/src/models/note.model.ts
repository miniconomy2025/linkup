import { Schema, model, Document } from 'mongoose';
import { NoteObject } from '../types/activitypub';

const BaseObjectFields: Record<string, any> = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image'] },
  attributedTo: { type: String, required: true },
  published: { type: String, required: true },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type NoteObjectDocument = NoteObject & Document;

const NoteSchema = new Schema<NoteObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Note'], required: true },
  content: { type: String, required: true },
} as const);

export const NoteModel = model<NoteObjectDocument>('Note', NoteSchema);
