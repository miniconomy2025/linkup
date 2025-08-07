const axios = require('axios');
const { createHash, createSign } = require('crypto');

export const ExternalApis = {
  getFromExternalApi: async (url: string): Promise<any> => {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
      }
    });

    return response;
  },

  postToExternalApi: async (url: string, payload: any, actorId: string): Promise<any> => {
    const privateKeyPem = process.env.USER_PRIVATE_KEY;
    const keyId = `${actorId}#main-key`;

    if (!privateKeyPem) {
      throw new Error('Missing USER_PRIVATE_KEY in environment');
    }

    const body = JSON.stringify(payload);
    const headers = ExternalApis.signRequest({
      url,
      body,
      privateKeyPem,
      keyId
    });

    headers.Accept = 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"';

    const response = await axios.post(url, body, { headers });
    return response;
  },

  signRequest: ({ url, body, privateKeyPem, keyId }: any) => {
    const date = new Date().toUTCString();
    const digest = 'SHA-256=' + createHash('sha256').update(body).digest('base64');

    const headers: Record<string, string> = {
      Host: new URL(url).host,
      Date: date,
      Digest: digest,
      'Content-Type': 'application/activity+json'
    };

    const signingString = `(request-target): post ${new URL(url).pathname}
        host: ${headers.Host}
        date: ${headers.Date}
        digest: ${headers.Digest}
        content-type: ${headers['Content-Type']}`;

    const signer = createSign('rsa-sha256');
    signer.update(signingString);
    signer.end();
    const signature = signer.sign(privateKeyPem, 'base64');

    headers.Signature = `keyId="${keyId}",algorithm="rsa-sha256",headers="(request-target) host date digest content-type",signature="${signature}"`;

    return headers;
  }
};
