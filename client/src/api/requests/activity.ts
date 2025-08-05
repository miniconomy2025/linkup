import { apiPost } from '../client';

export interface LikePostParams {
    postId: string;
};

export interface FollowActorParams {
    actorId: string;
};

export const likePost = (data: LikePostParams) => apiPost(`/activities/likes`, data);

export const followActor = (data: FollowActorParams) => apiPost(`/activities/follows`, data);