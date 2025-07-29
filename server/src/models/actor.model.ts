import { Schema, model, Document } from 'mongoose';
import { BaseActor, Actor } from '../types/activitypub';

const KeySchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  publicKeyPem: { type: String, required: true },
}, { _id: false });

const ActorSchema = new Schema<BaseActor>({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['Person', 'Group'] },
  preferredUsername: { type: String, required: true },
  inbox: { type: String, required: true },
  outbox: { type: String, required: true },
  followers: { type: String, required: true },
  publicKey: { type: KeySchema, required: false },
}, { timestamps: true });

export const ActorModel = model<Actor & Document>('Actor', ActorSchema); 