import { off } from "process";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { InboxRepository } from "../repositories/inbox.repository";
import { Activity, InboxItem } from "../types/activitypub";

const apiUrl = process.env.BASE_URL;

export const InboxService = {
    addActivityToInbox: async (activity: Activity, inboxActorId: string): Promise<void> => {
        if (inboxActorId.startsWith(apiUrl!)) {
            const inboxItem = await InboxRepository.addItem({
                actor: inboxActorId,
                activity: activity.id!
            });
        }
        else {
            // External inbox
        }
    },

    fanoutActivityToFollowersInboxes: async (activity: Activity): Promise<void> => {
        const followers = await ActorGraphRepository.getFollowerIds(activity.actor!);

        for (const follower of followers) {
            console.log(follower);
            await InboxService.addActivityToInbox(activity, follower);
        }
    },
}