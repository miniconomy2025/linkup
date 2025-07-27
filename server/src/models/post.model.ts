import { Schema, model, Document } from 'mongoose';
import { Post } from '../types/post';

interface PostDoc extends Post, Document {}

const PostSchema = new Schema<PostDoc>({
  iri: { type: String, required: true, unique: true },
  actorIri: { type: String, required: true },
  url: { type: String, required: true },
  content: String,
  published: { type: Date, required: true },
  to: [{ type: String }],
  cc: [{ type: String }]
}, { timestamps: true });

export default model<PostDoc>('Post', PostSchema);