import { apiPost } from '../client';

export interface LikePostParams {
    postId: string;
};

export const likePost = (data: LikePostParams) => apiPost(`/activities/likes`, data);