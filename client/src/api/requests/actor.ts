import { apiFetch } from '../client';

export interface SearchActorParams {
  query: string;
  page?: number;
  limit?: number;
}

export const searchActor = ({ query, page = 1, limit = 10 }: SearchActorParams) =>
  apiFetch(`/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);