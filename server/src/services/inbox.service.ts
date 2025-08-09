import { ActorGraphRepository } from "../graph/repositories/actor";
import { InboxRepository } from "../repositories/inbox.repository";
import { Activity, ActivityObject } from "../types/activitypub";
import { ExternalApis } from "../config/externalApis";
import { ObjectController } from "../controllers/object.controller";

const apiUrl = process.env.BASE_URL;
console.log('InboxService initialized with BASE_URL:', apiUrl);

export const InboxService = {
    addActivityToInbox: async (activity: Activity, inboxActorId: string): Promise<void> => {
        console.log('=== addActivityToInbox called ===');
        console.log('Activity:', JSON.stringify(activity, null, 2));
        console.log('Inbox Actor ID:', inboxActorId);
        console.log('API URL:', apiUrl);
        
        if (inboxActorId.startsWith(apiUrl!)) {
            console.log('Processing local inbox for actor:', inboxActorId);
            
            try {
                const _inboxItem = await InboxRepository.addItem({
                    actor: inboxActorId,
                    activity: activity.id!
                });
                console.log('Successfully added activity to local inbox:', _inboxItem);
            } catch (error) {
                console.error('Error adding activity to local inbox:', error);
                throw error;
            }
        }
        else {
            console.log('Processing external inbox for actor:', inboxActorId);
            console.log('Activity details:', activity);
            
            try {
                if (activity.type == 'Create') {
                    console.log('Processing Create activity');
                    const object = activity.object as ActivityObject;
                    console.log('Activity object:', JSON.stringify(object, null, 2));
                    console.log('Object type:', object.type);
       
                    if (object.type != 'Note') {
                        console.log('Object is not a Note, converting to Note type');
                        let noteActivity = activity as any;
           
                        if (object.type == 'Image') {
                            console.log('Processing Image object');
                            console.log('Image URL:', object.url);
                            
                            const imageType = ObjectController.getMediaType(object.url);
                            console.log('Detected image type:', imageType);
           
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
                            };
                            
                            console.log('Created Note type for Image:', JSON.stringify(noteType, null, 2));
                            noteActivity.object = noteType;
                            
                            console.log('Posting Image Note activity to external API:', `${inboxActorId}/inbox`);
                            const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, activity);
                            console.log('External API response for Image:', _inboxItem);
                        }
                        else {
                            console.log('Processing Video object (assuming non-Image, non-Note is Video)');
                            console.log('Video URL:', object.url);
                            
                            const videoType = ObjectController.getMediaType(object.url);
                            console.log('Detected video type:', videoType);
           
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
                            };
                            
                            console.log('Created Note type for Video:', JSON.stringify(noteType, null, 2));
                            noteActivity.object = noteType;
                            
                            console.log('Posting Video Note activity to external API:', `${inboxActorId}/inbox`);
                            const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, activity);
                            console.log('External API response for Video:', _inboxItem);
                        }
                    }
                    else {
                        console.log('Object is already a Note, posting directly');
                        console.log('Posting Note activity to external API:', `${inboxActorId}/inbox`);
                        const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, activity);
                        console.log('External API response for Note:', _inboxItem);
                    }
                }
                else {
                    console.log('Processing non-Create activity, type:', activity.type);
                    console.log('Posting activity to external API:', `${inboxActorId}/inbox`);
                    const _inboxItem = await ExternalApis.postToExternalApi(`${inboxActorId}/inbox`, activity);
                    console.log('External API response for non-Create activity:', _inboxItem);
                }
            }
            catch(error){
                console.error('Error processing external inbox activity:', error);
                console.error('Error details - Activity:', JSON.stringify(activity, null, 2));
                console.error('Error details - Inbox Actor ID:', inboxActorId);
                throw (error);
            }
        }
        
        console.log('=== addActivityToInbox completed ===');
    },

    fanoutActivityToFollowersInboxes: async (activity: Activity): Promise<void> => {
        console.log('=== fanoutActivityToFollowersInboxes called ===');
        console.log('Activity to fanout:', JSON.stringify(activity, null, 2));
        console.log('Activity actor:', activity.actor);
        
        try {
            console.log('Fetching followers for actor:', activity.actor);
            const followers = await ActorGraphRepository.getFollowerIds(activity.actor!);
            console.log('Found followers:', followers);
            console.log('Number of followers:', followers.length);
            
            if (followers.length === 0) {
                console.log('No followers found, fanout complete');
                return;
            }
            
            for (let i = 0; i < followers.length; i++) {
                const follower = followers[i];
                console.log(`Processing follower ${i + 1}/${followers.length}:`, follower);
                
                try {
                    await InboxService.addActivityToInbox(activity, follower);
                    console.log(`Successfully processed follower ${i + 1}/${followers.length}:`, follower);
                } catch (error) {
                    console.error(`Error processing follower ${i + 1}/${followers.length} (${follower}):`, error);
                    // Continue processing other followers even if one fails
                }
            }
            
            console.log('Fanout completed for all followers');
        } catch (error) {
            console.error('Error in fanoutActivityToFollowersInboxes:', error);
            console.error('Failed activity:', JSON.stringify(activity, null, 2));
            throw error;
        }
        
        console.log('=== fanoutActivityToFollowersInboxes completed ===');
    },
}