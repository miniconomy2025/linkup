import { apiPost } from '../client';

export interface CreatePostInput {
    content: string;
    caption: string;
};

export const newTextPost = (data: CreatePostInput) => apiPost('/api/object/text', data);
export const newImagePost = (data: FormData) => apiPost('/api/object/image', data);
export const newVideoPost = (data: FormData) => apiPost('/api/object/video', data);

