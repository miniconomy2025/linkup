import { CreateModel } from '../models/create.model';
import { FollowModel } from '../models/follow.model';
import { LikeModel } from '../models/like.model';
import { UndoModel } from '../models/undo.model';
import { CreateActivity, FollowActivity, LikeActivity, UndoActivity} from '../types/activitypub';

export const ActivityRepository = {
    saveCreateActivity: async (createActivity: CreateActivity): Promise<CreateActivity> => {
    const created = new CreateModel(createActivity);
    await created.save();
    return created.toObject();
  },

  saveFollowActivity: async (followActivity: FollowActivity): Promise<FollowActivity> => {
    const followed = new FollowModel(followActivity);
    await followed.save();
    return followed.toObject();
  },

  saveLikeActivity: async (likeActivity: LikeActivity): Promise<LikeActivity> => {
    const liked = new LikeModel(likeActivity);
    await liked.save();
    return liked.toObject();
  },

  saveUndoActivity: async (undoActivity: UndoActivity): Promise<UndoActivity> => {
    const undone = new UndoModel(undoActivity);
    await undone.save();
    return undone.toObject();
  },    
}; 