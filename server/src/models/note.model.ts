import { Schema, model, Document } from 'mongoose';
import { NoteObject } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseObjectFields: Record<string, any> = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image', 'Video'] },
  attributedTo: { type: String, required: true },
  published: { type: String, default: () => new Date().toISOString() },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type NoteObjectDocument = NoteObject & Document;

const NoteSchema = new Schema<NoteObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Note'], required: true },
  content: { type: String, required: true },
} as const, { timestamps: true, versionKey: false });

NoteSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/notes/${this._id.toString()}`;
  }
  next();
});

export const NoteModel = model<NoteObjectDocument>('Note', NoteSchema);
