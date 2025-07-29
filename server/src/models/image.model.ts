import { Schema, model, Document } from 'mongoose';
import { ImageObject } from '../types/activitypub';

const BaseObjectFields = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image'] },
  attributedTo: { type: String, required: true },
  published: { type: Date, required: true },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

const ImageSchema = new Schema<ImageObject>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Image'], required: true },
  url: { type: String, required: true },
  name: { type: String },
  mediaType: { type: String },
  width: { type: Number },
  height: { type: Number },
});

export const ImageModel = model<ImageObject & Document>('Image', ImageSchema); 