import { Schema, model, Document } from 'mongoose';
import { VideoObject } from '../types/activitypub';

const BaseObjectFields: Record<string, any> = {
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image', 'Video'] },
  attributedTo: { type: String, required: true },
  published: { type: String, required: true },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type VideoObjectDocument = VideoObject & Document;

export const VideoSchema = new Schema<VideoObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Video'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: false }
} as const);

export const VideoModel = model<VideoObjectDocument>('Video', VideoSchema);