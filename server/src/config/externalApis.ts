import { BadRequestError } from "../middleware/errorHandler";

const axios = require('axios');

export const ExternalApis = {
    getFromExternalApi: async (url: string): Promise<any> => {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
            }
        });

        return response.data;
    },

    postToExternalApi: async (url: string, payload: any): Promise<any> => {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/activity+json',
                'Accept': 'application/activity+json',
                'Date': new Date().toUTCString(),
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            validateStatus: () => true,
        });

        console.log('Response status code:', response.status);

        if (response.status >= 200 && response.status < 300) {
            console.log('Success!');
        } else {
            throw new BadRequestError(`Error or unexpected status: ${response}`);
        }

        return response;
    }
}