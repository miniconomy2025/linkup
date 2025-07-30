import { z } from 'zod';

// BaseObject and its variants
const BaseObjectSchema = z.object({
  id: z.url().optional(),
  type: z.string(), // will be overridden in specific schemas
  attributedTo: z.url(),
  published: z.iso.datetime(),
  to: z.array(z.url()),
});

export const NoteObjectSchema = BaseObjectSchema.extend({
  type: z.literal('Note'),
  content: z.string(),
});

export const ImageObjectSchema = BaseObjectSchema.extend({
  type: z.literal('Image'),
  url: z.url(),
  name: z.string().optional(),
});

export const VideoObjectSchema = BaseObjectSchema.extend({
  type: z.literal('Video'),
  url: z.url(),
  name: z.string().optional(),
});

export const ActivityObjectSchema = z.union([
  NoteObjectSchema,
  ImageObjectSchema,
]);

// BaseActivity and its variants
const BaseActivitySchema = z.object({
  id: z.url().optional(),
  type: z.string(), // will be narrowed in specific schemas
  actor: z.url(),
  published: z.iso.datetime().optional(),
  to: z.array(z.url()),
});

export const CreateActivitySchema = BaseActivitySchema.extend({
  type: z.literal('Create'),
  object: ActivityObjectSchema,
});

export const FollowActivitySchema = BaseActivitySchema.extend({
  type: z.literal('Follow'),
  object: z.url(),
});

export const LikeActivitySchema = BaseActivitySchema.extend({
  type: z.literal('Like'),
  object: z.url(),
});

export const UndoActivitySchema = BaseActivitySchema.extend({
  type: z.literal('Undo'),
  object: FollowActivitySchema,
});

export const ActivitySchema = z.union([
  CreateActivitySchema,
  FollowActivitySchema,
  LikeActivitySchema,
  UndoActivitySchema,
]);

// Actor and its variants
const BaseActorSchema = z.object({
  id: z.url(),
  type: z.string(), // narrowed in specific schemas
  preferredUsername: z.string(),
  name: z.string(),
  inbox: z.url(),
  outbox: z.url(),
  followers: z.url(),
  following: z.url(),
  icon: ImageObjectSchema.optional(),
});

export const PersonActorSchema = BaseActorSchema.extend({
  type: z.literal('Person'),
});

export const GroupActorSchema = BaseActorSchema.extend({
  type: z.literal('Group'),
});

export const ActorSchema = z.union([
  PersonActorSchema,
  GroupActorSchema,
]);

// Outbox & Inbox items
export const OutboxItemSchema = z.object({
  actor: z.url(),
  activity: z.url(),
  createdAt: z.coerce.date().optional(),
});

export const InboxItemSchema = z.object({
  actor: z.url(),
  activity: z.url(),
  receivedAt: z.coerce.date().optional(),
});
