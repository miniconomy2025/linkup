import { BadRequestError } from "../middleware/errorHandler";
const axios = require('axios');

export const ExternalApis = {
    getFromExternalApi: async (url: string): Promise<any> => {
        console.log('🌐 getFromExternalApi - START', { url });
        try {
            const response = await axios.get(url, {
                headers: {
                    Accept: 'application/activity+json, application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
                }
            });
            console.log('✅ getFromExternalApi - SUCCESS', { 
                url, 
                status: response.status, 
                statusText: response.statusText,
                dataSize: JSON.stringify(response.data).length
            });
            return response.data;
        } catch (error: unknown) {
            const axiosError = error as any; // Axios error type
            console.error('💥 getFromExternalApi - CATCH ERROR:', {
                url,
                error: axiosError?.message || 'Unknown error',
                status: axiosError?.response?.status,
                statusText: axiosError?.response?.statusText,
                data: axiosError?.response?.data
            });
            throw error;
        }
    },
    postToExternalApi: async (url: string, payload: any): Promise<any> => {
        console.log('🚀 postToExternalApi - START', { 
            url, 
            payloadType: payload?.type,
            payloadSize: JSON.stringify(payload).length
        });
        try {
            const enhancedPayload = {...payload, "@context": "https://www.w3.org/ns/activitystreams"};
            
            console.log('📤 postToExternalApi - Sending payload', {
                url,
                payload: JSON.stringify(enhancedPayload, null, 2)
            });

            const response = await axios.post(url, enhancedPayload, {
                headers: {
                    'Content-Type': 'application/activity+json',
                    'Accept': 'application/activity+json',
                    'Date': new Date().toUTCString(),
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                validateStatus: () => true,
            });

            console.log('📥 postToExternalApi - Response received', {
                url,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                dataSize: response.data ? JSON.stringify(response.data).length : 0
            });

            console.log('Response status code:', JSON.stringify(response.data, null, 2));
            
            console.log('✅ postToExternalApi - END', { 
                url, 
                status: response.status,
                success: response.status >= 200 && response.status < 300
            });
            
            return response;
        } catch (error: unknown) {
            const axiosError = error as any; // Axios error type
            console.error('💥 postToExternalApi - CATCH ERROR:', {
                url,
                error: axiosError?.message || 'Unknown error',
                status: axiosError?.response?.status,
                statusText: axiosError?.response?.statusText,
                data: axiosError?.response?.data,
                config: {
                    method: axiosError?.config?.method,
                    url: axiosError?.config?.url,
                    headers: axiosError?.config?.headers
                }
            });
            throw error;
        }
    }
}