export interface Post {
  iri: string;
  actorIri: string;
  url: string;
  content?: string;
  published: Date;
  to?: string[];
  cc?: string[];
}
