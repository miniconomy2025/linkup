export interface Comment {
  iri: string;
  actorIri: string;
  inReplyTo: string;
  content: string;
  published: Date;
  to?: string[];
  cc?: string[];
} 