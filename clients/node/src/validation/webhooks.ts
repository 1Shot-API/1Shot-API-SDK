import { z } from "zod";

// Event names that can trigger webhooks
export const eEventNameSchema = z
  .enum([
    "TransactionExecutionFailure",
    "TransactionExecutionSuccess",
    "EscrowWalletLowBalanceDetected",
    "EscrowWalletDepositConfirmed",
    "BusinessUserCreated",
    "BusinessUserDeleted",
    "InvoiceCreated",
  ])
  .describe("Event names that can trigger webhooks");

// Webhook status
export const eWebhookStatusSchema = z
  .enum(["Unsent", "Success", "Retrying", "Failed"])
  .describe("The current status of the webhook");

// WebhookEndpoint schema
export const webhookEndpointSchema = z
  .object({
    id: z.string().uuid().describe("The WebhookEndpointId"),
    destinationUrl: z.string().url().describe("The URL for the endpoint"),
    businessId: z.string().uuid().nullable().describe("Business ID"),
    userId: z.string().uuid().nullable().describe("User ID"),
    name: z.string().describe("Name for the endpoint"),
    description: z.string().describe("Description of the endpoint"),
    publicKey: z
      .string()
      .describe("Base64-encoded ED25519 public key for verifying webhook signatures"),
    verified: z.boolean().describe("Whether the endpoint has been verified"),
    lastPing: z.number().nullable().describe("Last ping timestamp"),
    lastPingStatus: z.boolean().describe("Last ping success status"),
    deleted: z.boolean().describe("Soft delete flag"),
    updated: z.number().describe("Unix timestamp of last update"),
    created: z.number().describe("Unix timestamp of creation"),
  })
  .describe("A webhook endpoint configuration");

// WebhookTrigger schema
export const webhookTriggerSchema = z
  .object({
    id: z.string().uuid().describe("Webhook trigger ID"),
    endpointId: z.string().uuid().nullable().describe("Webhook endpoint ID"),
    businessId: z.string().uuid().nullable().describe("Business ID"),
    userId: z.string().uuid().nullable().describe("User ID"),
    name: z.string().describe("Name for the trigger"),
    description: z.string().describe("Description of the trigger"),
    events: z.array(eEventNameSchema).describe("Event names that trigger the webhook"),
    contractMethodIds: z
      .array(z.string().uuid())
      .describe("Contract method IDs that trigger the webhook"),
    service: z.string().nullable().describe("Service identifier"),
    deleted: z.boolean().describe("Soft delete flag"),
    updated: z.number().describe("Unix timestamp of last update"),
    created: z.number().describe("Unix timestamp of creation"),
  })
  .describe("A webhook trigger configuration");

// Webhook schema (a single generated webhook delivery)
export const webhookSchema = z
  .object({
    id: z.string().uuid().describe("Webhook ID"),
    endpointId: z.string().uuid().describe("Endpoint ID"),
    eventName: z.string().describe("Event that triggered the webhook"),
    content: z.string().describe("JSON content of the webhook payload"),
    status: eWebhookStatusSchema.describe("Delivery status"),
    deleted: z.boolean().describe("Soft delete flag"),
    updated: z.number().describe("Unix timestamp of last update"),
    created: z.number().describe("Unix timestamp of creation"),
  })
  .describe("A generated webhook delivery");

// WebhookDeliveryAttempt schema
export const webhookDeliveryAttemptSchema = z
  .object({
    id: z.string().uuid().describe("Delivery attempt ID"),
    webhookId: z.string().uuid().describe("Webhook ID"),
    apiVersion: z.number().int().describe("API version"),
    httpResponse: z.number().int().describe("HTTP response code"),
    clientResponse: z.string().describe("Response from client"),
    signature: z.string().describe("Webhook signature"),
    timestamp: z.number().describe("Unix timestamp of attempt"),
  })
  .describe("A single webhook delivery attempt");

// GET /webhooks response - list of event names
export const webhookEventsResponseSchema = z
  .object({
    events: z.array(eEventNameSchema).describe("Event names that may trigger webhooks"),
  })
  .describe("Response listing available webhook event names");

// List triggers params
export const listTriggersSchema = z
  .object({
    businessId: z.string().uuid().describe("Business ID"),
    page: z.number().int().positive().optional().nullable(),
    pageSize: z.number().int().positive().optional().nullable(),
  })
  .describe("Parameters for listing webhook triggers");

// Create trigger body
export const createTriggerSchema = z
  .object({
    businessId: z.string().uuid().describe("Business ID"),
    endpointId: z.string().uuid().describe("Webhook endpoint ID to trigger"),
    eventNames: z.array(eEventNameSchema).describe("Event names that will trigger the webhook"),
    transactionIds: z
      .array(z.string().uuid())
      .optional()
      .nullable()
      .describe("Transaction IDs filter (if required by API)"),
    contractMethodIds: z
      .array(z.string().uuid())
      .optional()
      .nullable()
      .describe("Contract method IDs that will trigger the webhook"),
    name: z.string().describe("Name for the trigger"),
    description: z.string().optional().nullable().describe("Description of the trigger"),
  })
  .describe("Parameters for creating a webhook trigger");

// Update trigger body
export const updateTriggerSchema = z
  .object({
    endpointId: z.string().uuid().optional().nullable(),
    eventNames: z.array(eEventNameSchema).optional().nullable(),
    contractMethodIds: z.array(z.string().uuid()).optional().nullable(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
  .describe("Parameters for updating a webhook trigger");

// Trigger list response
export const webhookTriggerListSchema = z
  .object({
    response: z.array(webhookTriggerSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalResults: z.number().int().nonnegative(),
  })
  .describe("Paginated list of webhook triggers");

// List endpoints params
export const listEndpointsSchema = z
  .object({
    businessId: z.string().uuid().describe("Business ID"),
    page: z.number().int().positive().optional().nullable(),
    pageSize: z.number().int().positive().optional().nullable(),
  })
  .describe("Parameters for listing webhook endpoints");

// Create endpoint body
export const createEndpointSchema = z
  .object({
    businessId: z.string().uuid().describe("Business ID"),
    destinationUrl: z
      .string()
      .url()
      .describe("The URL to send the webhook to (http:// or https://)"),
    name: z.string().describe("Name for the endpoint"),
    description: z.string().optional().nullable().describe("Description of the endpoint"),
  })
  .describe("Parameters for creating a webhook endpoint");

// Update endpoint body
export const updateEndpointSchema = z
  .object({
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
  })
  .describe("Parameters for updating a webhook endpoint");

// Endpoint list response
export const webhookEndpointListSchema = z
  .object({
    response: z.array(webhookEndpointSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalResults: z.number().int().nonnegative(),
  })
  .describe("Paginated list of webhook endpoints");

// List webhooks for endpoint params
export const listWebhooksForEndpointSchema = z
  .object({
    webhookEndpointId: z.string().uuid().describe("Webhook endpoint ID"),
    page: z.number().int().positive().optional().nullable(),
    pageSize: z.number().int().positive().optional().nullable(),
  })
  .describe("Parameters for listing webhooks for an endpoint");

// Webhook list response
export const webhookListSchema = z
  .object({
    response: z.array(webhookSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalResults: z.number().int().nonnegative(),
  })
  .describe("Paginated list of webhooks");

// List delivery attempts params
export const listDeliveryAttemptsSchema = z
  .object({
    webhookId: z.string().uuid().describe("Webhook ID"),
    page: z.number().int().positive().optional().nullable(),
    pageSize: z.number().int().positive().optional().nullable(),
  })
  .describe("Parameters for listing webhook delivery attempts");

// Delivery attempts list response
export const webhookDeliveryAttemptListSchema = z
  .object({
    response: z.array(webhookDeliveryAttemptSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalResults: z.number().int().nonnegative(),
  })
  .describe("Paginated list of webhook delivery attempts");

// Get trigger by ID
export const getTriggerSchema = z
  .object({
    webhookTriggerId: z.string().uuid().describe("Webhook trigger ID"),
  })
  .describe("Parameters for getting a webhook trigger");

// Get endpoint by ID
export const getEndpointSchema = z
  .object({
    webhookEndpointId: z.string().uuid().describe("Webhook endpoint ID"),
  })
  .describe("Parameters for getting a webhook endpoint");

// Delete trigger response
export const deleteTriggerResponseSchema = z
  .object({
    success: z.boolean(),
  })
  .describe("Response from deleting a webhook trigger");

// Delete endpoint response
export const deleteEndpointResponseSchema = z
  .object({
    success: z.boolean(),
  })
  .describe("Response from deleting a webhook endpoint");
