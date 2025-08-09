import { ExternalActivityModel } from "../models/externalActivities";

export const ExternalActivityRepository = {
  createExternalActivity: async (activity: any): Promise<any> => {
    const created = await ExternalActivityModel.create(activity);
    return created.toObject();
  }
}; 