import { Activity, OutboxItem } from "../types/activitypub";
import { OutboxRepository } from "../repositories/outbox.repository";

export const OutboxService = {
  addActivityToOutbox: async (activity: Activity): Promise<OutboxItem> => {
    const outboxItem = await OutboxRepository.addItem({
        activity: activity.id!,
        actor: activity.actor
    });

    return outboxItem;
  },

}