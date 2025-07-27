import { Schema, model, Document } from 'mongoose';
import { Activity } from '../types/activitypub';

interface ActivityDoc extends Document {
  activity: Activity;
  ownerIri: string;
  boxType: 'inbox' | 'outbox';
  receivedAt?: Date;
  delivered?: boolean;
}

const ActivitySchema = new Schema<ActivityDoc>({
  ownerIri: { type: String, required: true },
  boxType: { type: String, enum: ['inbox', 'outbox'], required: true },
  activity: { type: Schema.Types.Mixed, required: true },
  receivedAt: Date,
  delivered: Boolean,
}, { timestamps: false });

export default model<ActivityDoc>('Activity', ActivitySchema); 