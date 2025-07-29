import { Schema, model, Document } from 'mongoose';
import { ImageObject } from '../types/activitypub';

const BaseObjectFields: Record<string, any> = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image'] },
  attributedTo: { type: String, required: true },
  published: { type: String, required: true },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type ImageObjectDocument = ImageObject & Document;

export const ImageSchema = new Schema<ImageObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Image'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: false }
} as const);

export const ImageModel = model<ImageObjectDocument>('Image', ImageSchema);