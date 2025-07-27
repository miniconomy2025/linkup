export interface Activity {
  '@context': string | string[];
  id: string;
  type: string;
  actor: string;
  object: any;
  to?: string[];
  cc?: string[];
  published?: string;
}

export interface LikeRecord {
  actorIri: string;
  objectIri: string;
  published: Date;
} 