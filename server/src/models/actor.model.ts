import { Schema, model, Document } from 'mongoose';
import { Actor } from '../types/activitypub';

type ActorDoc = Actor & Document;

const IconSchema = new Schema({
  id:           { type: String, required: true },
  type:         { type: String, required: true, enum: ['Image'] },
  attributedTo: { type: String, required: true },
  published:    { type: String, required: true },
  to:           { type: [String], required: true, default: ['https://www.w3.org/ns/activitystreams#Public'] },
  url:          { type: String, required: true },
  name:         { type: String }
}, {timestamps: true, versionKey: false, _id: false }); // <-- prevents automatic _id field

const ActorSchema = new Schema<ActorDoc>({
  id:               { type: String, required: true, unique: true },
  type:             { type: String, required: true, enum: ['Person', 'Group'] },
  preferredUsername:{ type: String, required: true },
  name:             { type: String, required: true },
  inbox:            { type: String, required: true },
  outbox:           { type: String, required: true },
  followers:        { type: String, required: true },
  following:        { type: String, required: true },
  icon:             { type: IconSchema, required: false }
}, { timestamps: true, versionKey: false });

export const ActorModel = model<ActorDoc>('Actor', ActorSchema);
