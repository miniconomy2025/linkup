import { Schema, model, Document } from 'mongoose';
import { NoteObject } from '../types/activitypub';

const BaseObjectFields = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image'] },
  attributedTo: { type: String, required: true },
  published: { type: Date, required: true },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

const NoteSchema = new Schema<NoteObject>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Note'], required: true },
  content: { type: String, required: true },
});

export const NoteModel = model<NoteObject & Document>('Note', NoteSchema); 