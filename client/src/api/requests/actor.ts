import type { Actor } from '../../types/types';
import { apiFetch } from '../client';

export interface SearchActorParams {
    query: string;
    page?: number;
    limit?: number;
};

export const searchActor = ({ query, page = 1, limit = 10 }: SearchActorParams) =>
  apiFetch(`/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

export const getActorProfile = (): Promise<Actor> => apiFetch('/profiles/me');
export const getActorPosts = () => apiFetch('/profiles/me/posts');

export const getCurrentActorFollowers = () => apiFetch(`/profiles/me/followers`);
export const getCurrentActorFollowing = () => apiFetch(`/profiles/me/following`);
