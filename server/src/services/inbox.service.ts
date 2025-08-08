import { ActorGraphRepository } from "../graph/repositories/actor";
import { InboxRepository } from "../repositories/inbox.repository";
import { Activity, ActivityObject } from "../types/activitypub";
import { ExternalApis } from "../config/externalApis";
import { ObjectController } from "../controllers/object.controller";

const apiUrl = process.env.BASE_URL;

export const InboxService = {
    addActivityToInbox: async (activity: Activity, inboxActorId: string): Promise<void> => {
        if (inboxActorId.startsWith(apiUrl!)) {
            const _inboxItem = await InboxRepository.addItem({
                actor: inboxActorId,
                activity: activity.id!
            });
        }
        else {
            console.log(activity);
            try {
                if (activity.type == 'Create') {
                    const object = activity.object as ActivityObject;
        
                    if (object.type != 'Note') {
                        let noteActivity = activity as any;
            
                        if (object.type == 'Image') {
                            const imageType = ObjectController.getMediaType(object.url);
            
                            const noteType = {
                                attributedTo: object.attributedTo,
                                content: object.name!,
                                type: "Note",
                                id: object.id,
                                published: object.published,
                                to: object.to,
                                attachment: {
                                    type: "Image",
                                    mediaType: `image/${imageType}`,
                                    url: object.url
                                }
                            } 
            
                            noteActivity.object = noteType;
                            const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, {
                                ...activity, actor: {id: activity.actor}});
                        }
                        else {
                            const videoType = ObjectController.getMediaType(object.url);
            
                            const noteType = {
                                attributedTo: object.attributedTo,
                                content: object.name!,
                                type: "Note",
                                id: object.id,
                                published: object.published,
                                to: object.to,
                                attachment: {
                                    type: "Video",
                                    mediaType: `video/${videoType}`,
                                    url: object.url
                                }
                            }
                            
                            noteActivity.object = noteType;
                            const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, {
                                ...activity, actor: {id: activity.actor}});
                        }
                    }
                    else {
                        const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, {
                                ...activity, actor: {id: activity.actor}});
                    }
                }
                else {
                    const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, {
                                ...activity, actor: {id: activity.actor}});
                }
            }
            catch(error){
                console.log(error);
                throw (error);
            }
        }
    },

    fanoutActivityToFollowersInboxes: async (activity: Activity): Promise<void> => {
        const followers = await ActorGraphRepository.getFollowerIds(activity.actor!);

        for (const follower of followers) {
            console.log(follower);
            await InboxService.addActivityToInbox(activity, follower);
        }
    },
}