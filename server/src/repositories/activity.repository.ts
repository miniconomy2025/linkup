import { Model } from 'mongoose';
import { CreateModel } from '../models/create.model';
import { FollowModel } from '../models/follow.model';
import { LikeModel } from '../models/like.model';
import { UndoModel } from '../models/undo.model';
import { Activity, CreateActivity, FollowActivity, LikeActivity, UndoActivity} from '../types/activitypub';

export const ActivityRepository = {
  saveCreateActivity: async (createActivity: CreateActivity): Promise<CreateActivity> => {
    const created = await CreateModel.create(createActivity);
    return created.toObject() as CreateActivity;
  },
  
  getFollowActivityByActorAndObject: async (
    actor: string,
    object: string
  ): Promise<FollowActivity | null> => {
    const followActivity = await FollowModel.findOne({ actor, object }).lean();
    return followActivity;
  },

  saveFollowActivity: async (followActivity: FollowActivity): Promise<FollowActivity> => {
    const created = await FollowModel.create(followActivity);
    return created.toObject() as FollowActivity;
  },

  saveLikeActivity: async (likeActivity: LikeActivity): Promise<LikeActivity> => {
    const created = await LikeModel.create(likeActivity);
    return created.toObject() as LikeActivity;
  },

  saveUndoActivity: async (undoActivity: UndoActivity): Promise<UndoActivity> => {
    const created = await UndoModel.create(undoActivity);
    return created.toObject() as UndoActivity;
  },    

  getActivityById: async (id: string): Promise<Activity | null> => {
    const createActivity = await CreateModel.findById(id).lean();
    if (createActivity) return createActivity as Activity;

    const followActivity = await FollowModel.findById(id).lean();
    if (followActivity) return followActivity as Activity;

    const likeActivity = await LikeModel.findById(id).lean();
    if (likeActivity) return likeActivity as Activity;

    const undoActivity = await UndoModel.findById(id).lean();
    if (undoActivity) return undoActivity as Activity;

    return null;
  },
}; 