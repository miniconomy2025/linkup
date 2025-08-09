import { ExternalApis } from '../config/externalApis';
import { ActorGraphRepository } from '../graph/repositories/actor';
import { ActorModel } from '../models/actor.model';
import { CreateModel } from '../models/create.model';
import { ExternalActivityModel } from '../models/externalActivities';
import { InboxItemModel } from '../models/inboxitem.model';
import { Actor, CreateActivity } from '../types/activitypub';

const apiUrl = process.env.BASE_URL;

export const ActorRepository = {
  getActorByGoogleId: async (googleId: string): Promise<Actor | null> => {
    return await ActorModel.findOne({ googleId: googleId }).lean<Actor>().exec();
  },
  getActorByUserName: async (userName: string): Promise<Actor | null> => {
    return await ActorModel.findOne({ preferredUsername: userName }).lean<Actor>().exec();
  },
  getActorById: async (id: string): Promise<Actor | null> => {
    return await ActorModel.findOne({ id }).lean<Actor>().exec();
  },
  createActor: async (actor: Actor): Promise<Actor> => {
    const created = new ActorModel(actor);
    await created.save();
    return created.toObject();
  },
  getCreateActivitiesByActor: async (actorId: string): Promise<CreateActivity[]> => {
    return await CreateModel.find({ actor: actorId, type: 'Create' }).sort({ createdAt: -1 }).lean();
  }, 

  getActorInboxCreateItems: async (actorId: string, page = 1, limit = 10): Promise<any> => {
    console.log(`[getActorInboxCreateItems] Starting - actorId: ${actorId}, page: ${page}, limit: ${limit}`);
    
    try {
        const skip = (page - 1) * limit;
        console.log(`[getActorInboxCreateItems] Calculated skip: ${skip}`);

        // Get inbox items
        console.log(`[getActorInboxCreateItems] Fetching inbox items for actor: ${actorId}`);
        const inboxItems = await InboxItemModel.find({ actor: actorId });
        console.log(`[getActorInboxCreateItems] Found ${inboxItems.length} inbox items`);

        // Extract activity IDs
        const activityIds = inboxItems.map((item) => item.activity);
        console.log(`[getActorInboxCreateItems] Extracted ${activityIds.length} activity IDs:`, activityIds);

        // Fetch activities from CreateModel
        console.log(`[getActorInboxCreateItems] Fetching activities from CreateModel with skip: ${skip}, limit: ${limit}`);
        const activities = await CreateModel.find({ id: { $in: activityIds } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        console.log(`[getActorInboxCreateItems] Found ${activities.length} activities from CreateModel`);

        // Fetch external activities
        console.log(`[getActorInboxCreateItems] Fetching external activities with skip: ${skip}, limit: ${limit}`);
        const externalActivities = await ExternalActivityModel.find({ id: { $in: activityIds } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        console.log(`[getActorInboxCreateItems] Found ${externalActivities.length} external activities`);

        // Create combined activity IDs array
        const allActivityIds = [
            ...activityIds,
            ...externalActivities.map(a => a.id),
            // ...ownActivities.map(a => a.id)
        ];
        console.log(`[getActorInboxCreateItems] Combined activity IDs count: ${allActivityIds.length}`);

        // Create activity map
        const activityMap = new Map(
            [...activities, ...externalActivities].map((a) => [a.id, a])
        );
        console.log(`[getActorInboxCreateItems] Created activity map with ${activityMap.size} entries`);

        // Order activities
        const orderedActivities = allActivityIds.map((id) => activityMap.get(id)).filter(Boolean) as typeof activities;
        console.log(`[getActorInboxCreateItems] Ordered activities count: ${orderedActivities.length}`);

        // Process each activity
        console.log(`[getActorInboxCreateItems] Processing ${orderedActivities.length} activities`);
        const results = await Promise.all(
            orderedActivities.map(async (activity, index) => {
                console.log(`[getActorInboxCreateItems] Processing activity ${index + 1}/${orderedActivities.length} - ID: ${activity.id}`);
                
                try {
                    // Check if user liked the post
                    console.log(`[getActorInboxCreateItems] Checking if user liked post - objectId: ${activity.object.id}, actorId: ${actorId}`);
                    const liked = await ActorGraphRepository.hasUserLikedPost(
                        activity.object.id!,
                        actorId
                    );
                    console.log(`[getActorInboxCreateItems] Liked status for activity ${activity.id}: ${liked}`);

                    let actor = null;
                    
                    // Determine if actor is internal or external
                    if (activity.actor.startsWith(apiUrl!)) {
                        console.log(`[getActorInboxCreateItems] Fetching internal actor: ${activity.actor}`);
                        actor = await ActorRepository.getActorById(activity.actor);
                        console.log(`[getActorInboxCreateItems] Internal actor fetched:`, actor ? `${actor.name} (${actor.id})` : 'null');
                    } else {
                        console.log(`[getActorInboxCreateItems] Fetching external actor: ${activity.actor}`);
                        actor = await ExternalApis.getFromExternalApi(activity.actor);
                        console.log(`[getActorInboxCreateItems] External actor fetched:`, actor ? `${actor.name} (${actor.id})` : 'null');
                    }

                    const result = { 
                        ...activity.toObject(), 
                        liked,
                        actor: { name: actor?.name, id: actor?.id } 
                    };
                    console.log(`[getActorInboxCreateItems] Successfully processed activity ${activity.id}`);
                    return result;
                    
                } catch (activityError) {
                    console.error(`[getActorInboxCreateItems] Error processing activity ${activity.id}:`, activityError);
                    throw activityError;
                }
            })
        );

        console.log(`[getActorInboxCreateItems] Successfully processed all activities. Returning ${results.length} results`);
        return results;
        
    } catch (error) {
        console.error(`[getActorInboxCreateItems] Function failed for actorId: ${actorId}, page: ${page}, limit: ${limit}`, error);
        throw error;
    }
},
}; 