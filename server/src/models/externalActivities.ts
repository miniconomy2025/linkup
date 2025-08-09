import { Schema, model, Document } from 'mongoose';

const ExternalActivitySchema = new Schema(
  {
    id: { type: String }, // Optional string ID
    object: {
      type: Schema.Types.Mixed, // Can be any object, may contain id, type, etc.
    },
  },
  {
    timestamps: true,
    strict: false, // Allow storing extra fields not in schema
    versionKey: false,
  }
);

export interface ExternalActivityDocument extends Document {
  id?: string;
  object?: Record<string, any>;
  [key: string]: any; // Allow arbitrary extra properties
}

export const ExternalActivityModel = model<ExternalActivityDocument>(
  'ExternalActivity',
  ExternalActivitySchema
);
