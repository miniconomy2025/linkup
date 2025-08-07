import { s3Service } from "../config/s3Uploader";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { ActivityObjectRepository } from "../repositories/activityObject.repository";
import { ActivityObject, ImageObject, NoteObject, VideoObject } from "../types/activitypub";
import { mapToActivityObject } from "../utils/mapping";
import { ActivityService } from "./activity.service";
import { InboxService } from "./inbox.service";
import { OutboxService } from "./outbox.service";

const apiUrl = process.env.BASE_URL;

export const ActivityObjectService = {
  getPostById: async (postId: string): Promise<ActivityObject> => {
    if (postId.startsWith(apiUrl!)) {
      const post = await ActivityObjectRepository.getObjectById(postId);

      return post;
    }
    else {
      const externalPost = await fetch(`${postId}`, {
        headers: {
          Accept: "application/activity+json",
        },
      });

      const data = await externalPost.json();

      // Map external post to what we expect:
      const activityObject: ActivityObject = mapToActivityObject(data)
      return activityObject;
    }
  }, 

  postNote: async (content: string, userName: string): Promise<NoteObject> => {
    const noteObject = await ActivityObjectRepository.createNote({
      type: 'Note',
      attributedTo: `${apiUrl}/actors/${userName}`,
      content: content
    });

    await ActorGraphRepository.createPostForUser(noteObject.id!, `${apiUrl}/actors/${userName}`);

    const activity = await ActivityService.makeCreateActivity(noteObject);

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return noteObject;
  },

  postImage: async (file: any, userName: string, caption = ''): Promise<ImageObject> => {
    const fileUrl = await s3Service.uploadFileBufferToS3(
      file.buffer,
      file.originalname,
      'images' // optional S3 folder
    );

    const imageObject = await ActivityObjectRepository.createImage({
      attributedTo: `${apiUrl}/actors/${userName}`,
      type: 'Image',
      url: fileUrl,
      name: caption
    })

    await ActorGraphRepository.createPostForUser(imageObject.id!, `${apiUrl}/actors/${userName}`)

    const activity = await ActivityService.makeCreateActivity(imageObject);

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return imageObject;
  },

  postVideo: async (file: any, userName: string, caption = ''): Promise<VideoObject> => { 
    const fileUrl = await s3Service.uploadFileBufferToS3(
      file.buffer,
      file.originalname,
      'videos'
    );

    const videoObject = await ActivityObjectRepository.createVideo({
      attributedTo: `${apiUrl}/actors/${userName}`,
      type: 'Video',
      url: fileUrl,
      name: caption
    });

    await ActorGraphRepository.createPostForUser(videoObject.id!, `${apiUrl}/actors/${userName}`);

    const activity = await ActivityService.makeCreateActivity(videoObject);
  
    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.fanoutActivityToFollowersInboxes(activity);

    return videoObject;
  }

}; 