import { s3Service } from "../config/s3Uploader";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { ActivityObjectRepository } from "../repositories/activityObject.repository";
import { ActivityObject, ImageObject, NoteObject, VideoObject } from "../types/activitypub";
import { ActivityService } from "./activity.service";
import { InboxService } from "./inbox.service";
import { OutboxService } from "./outbox.service";

const apiUrl = process.env.BASE_URL;

export const ActivityObjectService = {
  getPostById: async (postId: string): Promise<ActivityObject> => {
    if (postId.startsWith(apiUrl!)) {
      const post = ActivityObjectRepository.getObjectById(postId);

      return post;
    }
    else {
      // External post

      const activityObject: ActivityObject = {
        attributedTo: "test",
        type: "Image",
        url: "test"
      }

      return activityObject;
    }

  }, 

  postNote: async (content: string, googleId: string): Promise<NoteObject> => {
    const noteObject = await ActivityObjectRepository.createNote({
      type: 'Note',
      attributedTo: `${apiUrl}/actors/${googleId}`,
      content: content
    });

    await ActorGraphRepository.createPostForUser(noteObject.id!, `${apiUrl}/actors/${googleId}`);

    const activity = await ActivityService.makeCreateActivity(noteObject);

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return noteObject;
  },

  postImage: async (file: any, googleId: string, caption = ''): Promise<ImageObject> => {
    const fileUrl = await s3Service.uploadFileBufferToS3(
      file.buffer,
      file.originalname,
      'images' // optional S3 folder
    );

    const imageObject = await ActivityObjectRepository.createImage({
      attributedTo: `${apiUrl}/actors/${googleId}`,
      type: 'Image',
      url: fileUrl,
      name: caption
    })

    await ActorGraphRepository.createPostForUser(imageObject.id!, `${apiUrl}/actors/${googleId}`)

    const activity = await ActivityService.makeCreateActivity(imageObject);

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return imageObject;
  },

  postVideo: async (file: any, googleId: string, caption = ''): Promise<VideoObject> => { 
    const fileUrl = await s3Service.uploadFileBufferToS3(
      file.buffer,
      file.originalname,
      'videos'
    );

    const videoObject = await ActivityObjectRepository.createVideo({
      attributedTo: `${apiUrl}/actors/${googleId}`,
      type: 'Video',
      url: fileUrl,
      name: caption
    });

    await ActorGraphRepository.createPostForUser(videoObject.id!, `${apiUrl}/actors/${googleId}`);

    const activity = await ActivityService.makeCreateActivity(videoObject);
  
    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return videoObject;
  }

}; 