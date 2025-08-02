import { Schema, model, Document } from 'mongoose';

/**
 * ACTIVITYPUB CORE TYPES
 */

// Base Activity Interface
export interface BaseActivity {
  _id?: string;    // MongoDB ID
  id?: string;      // ActivityPub ID (URI)
  type: string;    // Activity type
  actor: string;   // Actor ID (URI)
  published?: string; // ISO date
  to?: string[];    // Recipients (URIs), default to peublic
}

// Create Activity: wraps an object creation
export interface CreateActivity extends BaseActivity {
  type: 'Create';
  object: ActivityObject;  // The created object
}

// Follow Activity: actor wants to follow object (person/group)
export interface FollowActivity extends BaseActivity {
  type: 'Follow';
  object: string;  // ID of actor being followed
}

// Like Activity: actor likes an object
export interface LikeActivity extends BaseActivity {
  type: 'Like';
  object: string;  // ID of object being liked
}

// Undo Activity: wraps an undoable activity (only unfollow)
export interface UndoActivity extends BaseActivity {
  type: 'Undo';
  object: FollowActivity;  // The Follow activity being undone
}

// Union of all Activities
export type Activity = CreateActivity | FollowActivity | LikeActivity | UndoActivity;



// Base Actor Interface
export interface BaseActor {
  _id?: string;
  id: string;        // Actor ID (URI)
  type: string;      // 'Person' or 'Group'
  preferredUsername: string;
  name: string;      // Display name
  inbox: string;     // Inbox URI
  outbox: string;    // Outbox URI
  followers: string; // Followers collection URI
  following: string;
  icon?: ImageObject; // Profile photo (reusing ImageObject)
}

export interface PersonActor extends BaseActor {
  type: 'Person';
}
export interface GroupActor extends BaseActor {
  type: 'Group';
}

export type Actor = PersonActor | GroupActor;



// ActivityPub Objects
export interface BaseObject {
  _id?: string;
  id?: string;      // Object ID (URI)
  type: string;    // 'Image' or 'Note' or 'Video'
  attributedTo: string;  // Actor ID
  published?: string;     // ISO date
  to?: string[];
}

export interface NoteObject extends BaseObject {
  type: 'Note';
  content: string;
}

export interface ImageObject extends BaseObject {
  type: 'Image';
  url: string;
  name?: string;
}

export interface VideoObject extends BaseObject {
  type: 'Video';
  url: string;
  name?: string;
}

export type ActivityObject = NoteObject | ImageObject | VideoObject; 


export interface OutboxItem {
  actor: string;     // Actor’s URI
  activity: string;  // Activity’s URI
  createdAt?: Date;  // auto‐set
}

export interface InboxItem {
  actor: string;     // Actor’s URI
  activity: string;  // Activity’s URI
  receivedAt?: Date; // auto‐set
}