import { apiPost } from '../client';

export interface CreatePostInput {
    content: string;
    caption: string;
};

export const newTextPost = (data: CreatePostInput) => apiPost('/objects/notes', data);
export const newImagePost = (data: FormData) => apiPost('/objects/images', data);
export const newVideoPost = (data: FormData) => apiPost('/objects/videos', data);

