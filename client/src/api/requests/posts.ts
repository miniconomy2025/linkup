import { apiPost } from '../client';

export interface CreatePostInput {
    content: string;
    caption: string;
};

export const newTextPost = (data: CreatePostInput) => apiPost('/api/objects/notes', data);
export const newImagePost = (data: FormData) => apiPost('/api/objects/images', data);
export const newVideoPost = (data: FormData) => apiPost('/api/objects/videos', data);

