const axios = require('axios');

export const ExternalApis = {
    getFromExternalApi: async (url: string): Promise<any> => {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
            }
        });

        return response;
    },

    postToExternalApi: async (url: string, payload: any): Promise<any> => {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"',
                'Accept': 'application/ld+json'
            }
        });

        return response;
    },
}