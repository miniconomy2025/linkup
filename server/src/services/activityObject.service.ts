import { s3Service } from "../config/s3Uploader";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { ActivityObjectRepository } from "../repositories/activityObject.repository";
import { ImageObject, NoteObject, VideoObject } from "../types/activitypub";
import { ActivityService } from "./activity.service";
import { OutboxService } from "./outbox.service";

const appUrl = process.env.BASE_URL;

export const ActivityObjectService = {
  postNote: async (content: string, googleId: string): Promise<NoteObject> => {
    const noteObject = await ActivityObjectRepository.createNote({
      type: 'Note',
      attributedTo: `${appUrl}/actors/${googleId}`,
      content: content
    });

    // Add to graph

    const activity = await ActivityService.makeCreateActivity(noteObject);

    const outboxItem = await OutboxService.addActivityToOutbox(activity);

    // Fanout to inboxes

    return noteObject;
  },

  postImage: async (file: any, googleId: string, caption = ''): Promise<ImageObject> => {
    const fileUrl = await s3Service.uploadFileBufferToS3(
      file.buffer,
      file.originalname,
      'images' // optional S3 folder
    );

    const imageObject = await ActivityObjectRepository.createImage({
      attributedTo: `${appUrl}/actors/${googleId}`,
      type: 'Image',
      url: fileUrl,
      name: caption
    })

    await ActorGraphRepository.createPostForUser(imageObject.id!, `${appUrl}/actors/${googleId}`)

    const activity = await ActivityService.makeCreateActivity(imageObject);

    const outboxItem = await OutboxService.addActivityToOutbox(activity);

    // Fanout to inboxes

    return imageObject;
  },

  postVideo: async (file: string, googleId: string, caption = ''): Promise<VideoObject> => {
    // Create video
    const url = '';

    const videoObject = await ActivityObjectRepository.createVideo({
      attributedTo: `${appUrl}/actors/${googleId}`,
      type: 'Video',
      url: url
    })

    // Add to graph

    const activity = await ActivityService.makeCreateActivity(videoObject);

    const outboxItem = await OutboxService.addActivityToOutbox(activity);

    // Fanout to inboxes

    return videoObject;
  },


}; 