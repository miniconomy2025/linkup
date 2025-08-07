import { Actor } from '../types/activitypub';
import { SearchRepository } from '../repositories/search.repository';

export const SearchService = {
    searchActors: async (
        query: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ results: Actor[]; total: number; page: number; limit: number; pages: number }> => {
        const { results, total } = await SearchRepository.searchActors(query, page, limit);
        return {
            results,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        };
    },
    searchActor: async (query: string): Promise<{ actor: Actor | null }> => {
        const actor = await SearchRepository.searchActor(query);
        return actor;
    }
}; 