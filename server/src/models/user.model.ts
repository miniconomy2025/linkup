import { Schema, model, Document } from 'mongoose';
import { User } from '../types/user';

interface UserDoc extends User, Document {}

const PublicKeySchema = new Schema({
  id: { type: String, required: true },
  owner: { type: String, required: true },
  publicKeyPem: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<UserDoc>({
  iri: { type: String, required: true, unique: true },
  preferredUsername: String,
  displayName: String,
  inbox: { type: String, required: true },
  outbox: { type: String, required: true },
  followers: String,
  following: String,
  publicKey: { type: PublicKeySchema, required: true },
  privateKeyPem: { type: String, select: false },
  isLocal: { type: Boolean, required: true },
  googleSub: String,
}, { timestamps: true });

export default model<UserDoc>('User', UserSchema); 