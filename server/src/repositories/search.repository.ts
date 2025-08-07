import { ActorModel } from '../models/actor.model';
import { Actor } from '../types/activitypub';

export const SearchRepository = {
    searchActors: async (
        query: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ results: Actor[]; total: number }> => {
        const searchRegex = new RegExp(query, 'i'); // case-insensitive regex

        const filter = {
            $or: [
                { preferredUsername: { $regex: searchRegex } },
                { name: { $regex: searchRegex } }
            ]
        };

        const total = await ActorModel.countDocuments(filter);
        const results = await ActorModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        // TODO take results and check if the user requesting the data is already following them
        // TODO add a custom field in the results to indicate if they are already following    

        return { results, total };
    },
    searchActor: async (query: string): Promise<{ actor: Actor | null }> => {
        const searchRegex = new RegExp(query, 'i'); // case-insensitive regex

        const filter = {
            $or: [
                { preferredUsername: { $regex: searchRegex } },
                { name: { $regex: searchRegex } }
            ]
        };

        const actor = await ActorModel.findOne(filter).exec();
        return { actor };
    }
}; 