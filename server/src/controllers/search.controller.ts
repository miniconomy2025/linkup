import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export const SearchController = {
    searchActor: async (req: Request, res: Response, next: NextFunction) => {
        const { query, page = 1, limit = 10 } = req.query;
        
        if (!query) return res.status(400).json({ error: 'Missing search query' });

        try {
            const result = await SearchService.searchActors(query.toString(), +page, +limit);
            res.json(result); // includes results, total, page, limit, pages
        } catch (err) {
            res.status(500).json({ error: 'Server error' });
        };
    },
}; 