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
    const created = await ImageModel.create(image);
    return created.toObject() as ImageObject;
  },

  createVideo: async (video: VideoObject): Promise<VideoObject> => {
    const created = await VideoModel.create(video);
    return created.toObject() as VideoObject;
  },
}; 