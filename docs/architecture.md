# Pontis Architecture

Pontis is an inbound-first Instagram conversation desk. The first production path uses a responsive web app backed by AWS, with desktop and mobile clients sharing the same API model.

## Product Flow

1. A customer sends a message to an Instagram professional account.
2. Meta calls the Pontis webhook endpoint.
3. API Gateway invokes the webhook Lambda.
4. The webhook Lambda verifies the Meta signature and sends the payload to SQS.
5. The processor Lambda stores the message in DynamoDB, builds a context packet, calls Bedrock, and stores the draft.
6. AppSync exposes conversations, messages, drafts, and realtime updates to the web/mobile clients.
7. A human reviews or edits the draft before sending.

## Context Strategy

Pontis should not send an entire conversation history to the model every time. The backend builds a compact context packet:

- recent messages from DynamoDB
- rolling conversation summary
- extracted customer facts
- business rules and brand voice
- relevant FAQ/product knowledge
- prior AI drafts and human edits

If backfilled Instagram history is incomplete, the model context should include a `historyCompleteness` flag and the UI should clearly show the oldest available message.

## Privacy Defaults

- Tenant ID is present on tenant-owned records.
- DynamoDB server-side encryption is enabled.
- Meta secrets live in Secrets Manager.
- Raw message bodies should not be written to CloudWatch logs.
- AI drafts require human approval before sending.
- Retention and export/delete controls should be added before selling to third-party customers.

## Local AI

The v1 AI implementation uses Bedrock because it keeps the processing path inside AWS. The processor should keep AI behind an adapter so a local model can be added later for customers who want a desktop-only or bring-your-own-compute mode.
