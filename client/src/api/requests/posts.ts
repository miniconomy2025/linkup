import { apiFetch, apiPost } from '../client';

export interface CreatePostInput {
    content: string;
};

export const newTextPost = (data: CreatePostInput) => apiPost('/objects/notes', data);
export const newImagePost = (data: FormData) => apiPost('/objects/images', data);
export const newVideoPost = (data: FormData) => apiPost('/objects/videos', data);

export interface GetPostParams {
    url: string;
};

export const getPost = ({ url }: GetPostParams) => apiFetch(`/objects/posts?postId=${encodeURIComponent(url)}`);

export interface GetFeedParams {
    page?: number;
    limit?: number;
};

export const getFeed = ({ page = 1, limit = 2 }: GetFeedParams) => apiFetch(`/feeds?page=${page}&limit=${limit}`);