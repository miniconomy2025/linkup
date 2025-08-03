import { NoteModel } from '../models/note.model';
import { ImageModel } from '../models/image.model';
import { VideoModel } from '../models/video.model';
import { ActivityObject, ImageObject, NoteObject, VideoObject } from '../types/activitypub';
import { Model } from 'mongoose';

export const ActivityObjectRepository = {
  getObjectById: async (id: string): Promise<ActivityObject> => {
    const models: Model<any>[] = [NoteModel, ImageModel, VideoModel];

    for (const model of models) {
      const activityObject = await model.findOne({ id }).exec();
      if (activityObject) {
        return activityObject.toObject() as ActivityObject;
      }
    }
    throw new Error(`Object with ID ${id} not found.`);
  },

  createNote: async (note: NoteObject): Promise<NoteObject> => {
    const created = await NoteModel.create(note);
    return created.toObject() as NoteObject;
  },

  createImage: async (image: ImageObject): Promise<ImageObject> => {
    const created = await ImageModel.create(image);
    return created.toObject() as ImageObject;
  },

  createVideo: async (video: VideoObject): Promise<VideoObject> => {
    const created = await VideoModel.create(video);
    return created.toObject() as VideoObject;
  },
}; 