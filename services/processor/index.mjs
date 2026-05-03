import { randomUUID } from 'node:crypto';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const bedrock = new BedrockRuntimeClient({});
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event) {
  for (const record of event.Records ?? []) {
    const payload = JSON.parse(record.body);
    const normalizedMessages = normalizeInstagramMessages(payload);

    for (const message of normalizedMessages) {
      await storeInboundMessage(message);
      const context = await buildConversationContext(message.conversationId);
      const draft = await generateDraft(context, message);
      await storeDraft(message.conversationId, draft);
    }
  }
}

function normalizeInstagramMessages(payload) {
  const entries = payload.entry ?? [];

  return entries.flatMap((entry) =>
    (entry.messaging ?? []).map((item) => {
      const messageId = item.message?.mid ?? randomUUID();
      const senderId = item.sender?.id ?? 'unknown_sender';
      const recipientId = item.recipient?.id ?? entry.id ?? 'unknown_account';
      const conversationId = `${recipientId}:${senderId}`;

      return {
        tenantId: 'tenant_pending_onboarding',
        accountId: recipientId,
        conversationId,
        messageId,
        body: item.message?.text ?? '[unsupported Instagram message type]',
        sentAt: new Date(Number(item.timestamp ?? Date.now())).toISOString(),
        instagramScopedId: senderId,
      };
    }),
  );
}

async function storeInboundMessage(message) {
  const now = new Date().toISOString();

  await dynamo.send(
    new PutCommand({
      TableName: process.env.MESSAGES_TABLE,
      Item: {
        conversationId: message.conversationId,
        messageId: message.messageId,
        direction: 'INBOUND',
        body: message.body,
        sentAt: message.sentAt,
        source: 'INSTAGRAM_WEBHOOK',
      },
      ConditionExpression: 'attribute_not_exists(messageId)',
    }),
  );

  await dynamo.send(
    new UpdateCommand({
      TableName: process.env.CONVERSATIONS_TABLE,
      Key: {
        tenantId: message.tenantId,
        conversationId: message.conversationId,
      },
      UpdateExpression:
        'SET accountId = :accountId, instagramThreadId = :threadId, participant = :participant, #status = :status, historyCompleteness = if_not_exists(historyCompleteness, :history), updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':accountId': message.accountId,
        ':threadId': message.conversationId,
        ':participant': { instagramScopedId: message.instagramScopedId },
        ':status': 'NEEDS_REPLY',
        ':history': 'FULL_FROM_CONNECTION',
        ':updatedAt': now,
      },
    }),
  );
}

async function buildConversationContext(conversationId) {
  const result = await dynamo.send(
    new QueryCommand({
      TableName: process.env.MESSAGES_TABLE,
      KeyConditionExpression: 'conversationId = :conversationId',
      ExpressionAttributeValues: {
        ':conversationId': conversationId,
      },
      ScanIndexForward: false,
      Limit: 30,
    }),
  );

  const recentMessages = [...(result.Items ?? [])].reverse();

  return {
    brandRules: [
      'Be concise, specific, and warm.',
      'Do not promise refunds, discounts, dates, or availability unless already stated in context.',
      'Ask for human review when the answer depends on missing account data.',
    ],
    summary: 'No prior summary is available yet. Use the recent messages as the source of truth.',
    recentMessages,
  };
}

async function generateDraft(context, newMessage) {
  const prompt = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 700,
    temperature: 0.2,
    system:
      'You are Pontis, an assistant that drafts Instagram business replies for human approval. Return only valid JSON.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              task: 'Generate a precise conversation summary and suggested reply.',
              outputSchema: {
                intent: 'short label',
                confidence: 'number between 0 and 1',
                needsHuman: 'boolean',
                missingContext: ['string'],
                summaryUpdate: 'string',
                suggestedReply: 'string',
              },
              brandRules: context.brandRules,
              currentSummary: context.summary,
              recentMessages: context.recentMessages,
              newMessage,
            }),
          },
        ],
      },
    ],
  };

  const response = await bedrock.send(
    new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(prompt),
    }),
  );

  const decoded = JSON.parse(new TextDecoder().decode(response.body));
  const text = decoded.content?.[0]?.text ?? '{}';
  return JSON.parse(text);
}

async function storeDraft(conversationId, draft) {
  await dynamo.send(
    new PutCommand({
      TableName: process.env.DRAFTS_TABLE,
      Item: {
        conversationId,
        draftId: randomUUID(),
        body: draft.suggestedReply ?? '',
        confidence: draft.confidence ?? 0,
        missingContext: draft.missingContext ?? [],
        summaryUpdate: draft.summaryUpdate ?? '',
        needsHuman: draft.needsHuman ?? true,
        generatedAt: new Date().toISOString(),
      },
    }),
  );
}
