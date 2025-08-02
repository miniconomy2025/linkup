import { Schema, model, Document } from 'mongoose';
import { ImageObject } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseObjectFields: Record<string, any> = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image', 'Video'] },
  attributedTo: { type: String, required: true },
  published: { type: String, default: () => new Date().toISOString() },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type ImageObjectDocument = ImageObject & Document;

export const ImageSchema = new Schema<ImageObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Image'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: false }
} as const, { timestamps: true, versionKey: false });

ImageSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/images/${this._id.toString()}`;
  }
  next();
});

export const ImageModel = model<ImageObjectDocument>('Image', ImageSchema);