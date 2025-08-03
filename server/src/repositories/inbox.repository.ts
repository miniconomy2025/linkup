import { InboxItemModel } from "../models/inboxitem.model";
import { InboxItem } from "../types/activitypub";

export const InboxRepository = {
  addItem: async (item: InboxItem): Promise<InboxItem> => {
    const created = await InboxItemModel.create(item);
    return created.toObject() as InboxItem;
  },
};
