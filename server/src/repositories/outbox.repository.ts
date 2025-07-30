import { OutboxItem } from '../types/activitypub';
import { OutboxItemModel } from '../models/outboxitem.model';

export const OutboxRepository = {
  addItem: async (item: OutboxItem): Promise<OutboxItem> => {
    const created = await OutboxItemModel.create(item);
    return created.toObject() as OutboxItem;
  },

  getItemsForActor: async (actorId: string): Promise<OutboxItem[]> => {
    return await OutboxItemModel.find({ actor: actorId }).lean();
  },
};
