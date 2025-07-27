import { Schema, model, Document } from 'mongoose';
import { Comment } from '../types/comment';

interface CommentDoc extends Comment, Document {}

const CommentSchema = new Schema<CommentDoc>({
  iri: { type: String, required: true, unique: true },
  actorIri: { type: String, required: true },
  inReplyTo: { type: String, required: true },
  content: { type: String, required: true },
  published: { type: Date, required: true },
  to: [{ type: String }],
  cc: [{ type: String }],
}, { timestamps: true });

export default model<CommentDoc>('Comment', CommentSchema); 