// actor.model.ts
import { Schema, model, Document } from 'mongoose';
import { Actor } from '../types/activitypub';
import { ImageSchema } from './image.model';

type ActorDoc = Actor & Document;

const ActorSchema = new Schema<ActorDoc>({
  id:               { type: String, required: true, unique: true },
  type:             { type: String, required: true, enum: ['Person', 'Group'] },
  preferredUsername:{ type: String, required: true },
  name:             { type: String, required: true },
  inbox:            { type: String, required: true },
  outbox:           { type: String, required: true },
  followers:        { type: String, required: true },
  following:        { type: String, required: true },
  icon:             { type: ImageSchema, required: false },
}, { timestamps: true });

export const ActorModel = model<ActorDoc>('Actor', ActorSchema);
