import crypto from 'node:crypto';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const sqs = new SQSClient({});
const secrets = new SecretsManagerClient({});

export async function handler(event) {
  if (event.requestContext.http.method === 'GET') {
    return verifyWebhook(event);
  }

  if (event.requestContext.http.method === 'POST') {
    return receiveWebhook(event);
  }

  return { statusCode: 405, body: 'Method not allowed' };
}

async function verifyWebhook(event) {
  const params = event.queryStringParameters ?? {};
  const verifyToken = await readSecret(process.env.META_VERIFY_TOKEN_ARN);

  if (params['hub.mode'] === 'subscribe' && params['hub.verify_token'] === verifyToken) {
    return {
      statusCode: 200,
      headers: { 'content-type': 'text/plain' },
      body: params['hub.challenge'] ?? '',
    };
  }

  return { statusCode: 403, body: 'Verification failed' };
}

async function receiveWebhook(event) {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
    : event.body ?? '';

  await assertMetaSignature(body, event.headers ?? {});

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: process.env.MESSAGE_QUEUE_URL,
      MessageBody: body,
    }),
  );

  return { statusCode: 200, body: 'EVENT_RECEIVED' };
}

async function assertMetaSignature(body, headers) {
  const signature = headers['x-hub-signature-256'] ?? headers['X-Hub-Signature-256'];
  if (!signature) throw new Error('Missing Meta signature');

  const appSecret = await readSecret(process.env.META_APP_SECRET_ARN);
  const expected =
    'sha256=' + crypto.createHmac('sha256', appSecret).update(body, 'utf8').digest('hex');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) throw new Error('Invalid Meta signature');
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) throw new Error('Invalid Meta signature');
}

async function readSecret(secretId) {
  const result = await secrets.send(new GetSecretValueCommand({ SecretId: secretId }));
  return result.SecretString ?? Buffer.from(result.SecretBinary).toString('utf8');
}
