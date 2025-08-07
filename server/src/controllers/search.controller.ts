import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export const SearchController = {
    searchActor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { query } = req.body;
            
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ error: 'Missing or invalid search query' });
            };

            if (query.includes('@')) {

                const [username, domain] = query.split('@');

                const url = `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`;

                try {
                    const response = await fetch(url, {
                        headers: {
                            Accept: 'application/jrd+json, application/json'
                        }
                    });
                    if (!response.ok) {
                        return res.status(response.status).json({ error: 'WebFinger fetch failed' });
                    };
                    const data = await response.json();

                    const returnFederatedObject = {
                        id: data.subject,
                        name: data.subject,
                        icon: data?.links[1]?.href
                    };

                    return res.json(returnFederatedObject);
                } catch (error) {
                    console.error('Failed to fetch WebFinger:', error);
                    return res.status(500).json({ error: 'WebFinger lookup failed' });
                };
            };

            const { actor } = await SearchService.searchActor(query.toString());

            if (!actor) {
                return res.status(404).json({ error: 'No user found' });
            };

            const returnObject = {
                id: actor.id,
                name: actor.name,
                icon: actor.icon?.url
            };

            res.json(returnObject);
            
        } catch (error) {
            next(error);
        }
    },
}; 