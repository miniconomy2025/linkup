import { Schema, model, Document } from 'mongoose';
import { VideoObject } from '../types/activitypub';

const BASE_URL = process.env.BASE_URL || 'https://localhost:3000'; 

const BaseObjectFields: Record<string, any> = {
  id: { type: String, unique: true },
  type: { type: String, required: true, enum: ['Note', 'Image', 'Video'] },
  attributedTo: { type: String, required: true },
  published: { type: String, default: () => new Date().toISOString() },
  to: { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
};

type VideoObjectDocument = VideoObject & Document;

export const VideoSchema = new Schema<VideoObjectDocument>({
  ...BaseObjectFields,
  type: { type: String, enum: ['Video'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: false }
} as const, { timestamps: true, versionKey: false });

VideoSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `${BASE_URL}/videos/${this._id.toString()}`;
  }
  next();
});

export const VideoModel = model<VideoObjectDocument>('Video', VideoSchema);