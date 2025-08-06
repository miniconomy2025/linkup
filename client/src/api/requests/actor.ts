import type { Actor } from '../../types/types';
import { apiFetch } from '../client';

export interface SearchActorParams {
    query: string;
    page?: number;
    limit?: number;
};

export const searchActor = ({ query, page = 1, limit = 10 }: SearchActorParams) =>
  apiFetch(`/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);

export const getActorProfile = () => apiFetch('/profiles/me');
export const getActorPosts = () => apiFetch('/profiles/me/posts');

export const getActorFollowers = ({ url }) => apiFetch(`/profiles/followers?actorId=${encodeURIComponent(url)}`);
export const getActorFollowing = ({ url }) => apiFetch(`/profiles/following?actorId=${encodeURIComponent(url)}`);

export const getCurrentActorFollowers = () => apiFetch(`/profiles/me/followers`);
export const getCurrentActorFollowing = () => apiFetch(`/profiles/me/following`);

export const getOtherActorProfile = ({ url }) => apiFetch(`/profiles/?actorId=${encodeURIComponent(url)}`);
export const getOtherActorPosts = ({ url })=> apiFetch(`/profiles/posts/?actorId=${encodeURIComponent(url)}`);
