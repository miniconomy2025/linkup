import { NoteModel } from '../models/note.model';
import { ImageModel } from '../models/image.model';
import { VideoModel } from '../models/video.model';
import { ImageObject, NoteObject, VideoObject } from '../types/activitypub';

export const ActivityObjectRepository = {
  createNote: async (note: NoteObject): Promise<NoteObject> => {
    const created = await NoteModel.create(note);
    return created.toObject() as NoteObject;
  },

  createImage: async (image: ImageObject): Promise<ImageObject> => {
    try {
      const created = await ImageModel.create(image);
      return created.toObject() as ImageObject;
    }
    catch(err) {
      console.log(err);
      const error = err as any;
      console.log('Full error details:', JSON.stringify(error.errInfo?.details, null, 2));
      console.log('Schema rules not satisfied:', error.errInfo?.details?.schemaRulesNotSatisfied);
      throw error;
    }
  },

  createVideo: async (video: VideoObject): Promise<VideoObject> => {
    const created = await VideoModel.create(video);
    return created.toObject() as VideoObject;
  },
}; 