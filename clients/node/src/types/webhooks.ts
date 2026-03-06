import { z } from "zod";

import {
  eEventNameSchema,
  eWebhookStatusSchema,
  webhookEndpointSchema,
  webhookTriggerSchema,
  webhookSchema,
  webhookDeliveryAttemptSchema,
  webhookEventsResponseSchema,
  listTriggersSchema,
  createTriggerSchema,
  updateTriggerSchema,
  webhookTriggerListSchema,
  listEndpointsSchema,
  createEndpointSchema,
  updateEndpointSchema,
  webhookEndpointListSchema,
  listWebhooksForEndpointSchema,
  webhookListSchema,
  listDeliveryAttemptsSchema,
  webhookDeliveryAttemptListSchema,
  getTriggerSchema,
  getEndpointSchema,
  deleteTriggerResponseSchema,
  deleteEndpointResponseSchema,
} from "../validation/webhooks.js";

export type EEventName = z.infer<typeof eEventNameSchema>;
export type EWebhookStatus = z.infer<typeof eWebhookStatusSchema>;
export type WebhookEndpoint = z.infer<typeof webhookEndpointSchema>;
export type WebhookTrigger = z.infer<typeof webhookTriggerSchema>;
export type Webhook = z.infer<typeof webhookSchema>;
export type WebhookDeliveryAttempt = z.infer<typeof webhookDeliveryAttemptSchema>;
export type WebhookEventsResponse = z.infer<typeof webhookEventsResponseSchema>;
export type ListTriggersParams = z.infer<typeof listTriggersSchema>;
export type CreateTriggerParams = z.infer<typeof createTriggerSchema>;
export type UpdateTriggerParams = z.infer<typeof updateTriggerSchema>;
export type WebhookTriggerList = z.infer<typeof webhookTriggerListSchema>;
export type ListEndpointsParams = z.infer<typeof listEndpointsSchema>;
export type CreateEndpointParams = z.infer<typeof createEndpointSchema>;
export type UpdateEndpointParams = z.infer<typeof updateEndpointSchema>;
export type WebhookEndpointList = z.infer<typeof webhookEndpointListSchema>;
export type ListWebhooksForEndpointParams = z.infer<typeof listWebhooksForEndpointSchema>;
export type WebhookList = z.infer<typeof webhookListSchema>;
export type ListDeliveryAttemptsParams = z.infer<typeof listDeliveryAttemptsSchema>;
export type WebhookDeliveryAttemptList = z.infer<typeof webhookDeliveryAttemptListSchema>;
export type GetTriggerParams = z.infer<typeof getTriggerSchema>;
export type GetEndpointParams = z.infer<typeof getEndpointSchema>;
export type DeleteTriggerResponse = z.infer<typeof deleteTriggerResponseSchema>;
export type DeleteEndpointResponse = z.infer<typeof deleteEndpointResponseSchema>;
