import { z } from "zod";

import { IOneShotClient } from "../types/client.js";
import { PagedResponse } from "../types/common.js";
import {
  WebhookEndpoint,
  WebhookTrigger,
  Webhook,
  WebhookDeliveryAttempt,
  WebhookEventsResponse,
} from "../types/webhooks.js";
import {
  webhookEventsResponseSchema,
  listTriggersSchema,
  createTriggerSchema,
  updateTriggerSchema,
  webhookTriggerListSchema,
  listEndpointsSchema,
  createEndpointSchema,
  updateEndpointSchema,
  webhookEndpointListSchema,
  webhookEndpointSchema,
  webhookTriggerSchema,
  webhookListSchema,
  listWebhooksForEndpointSchema,
  listDeliveryAttemptsSchema,
  webhookDeliveryAttemptListSchema,
  getTriggerSchema,
  getEndpointSchema,
  deleteTriggerResponseSchema,
  deleteEndpointResponseSchema,
} from "../validation/webhooks.js";

const listTriggersSchemaOptions = listTriggersSchema.omit({ businessId: true });
const listEndpointsSchemaOptions = listEndpointsSchema.omit({ businessId: true });
const createTriggerSchemaOptions = createTriggerSchema.omit({ businessId: true });
const createEndpointSchemaOptions = createEndpointSchema.omit({ businessId: true });
const listWebhooksForEndpointSchemaOptions = listWebhooksForEndpointSchema.omit({
  webhookEndpointId: true,
});
const listDeliveryAttemptsSchemaOptions = listDeliveryAttemptsSchema.omit({ webhookId: true });

export class Webhooks {
  constructor(private client: IOneShotClient) {}

  /**
   * Returns event names that may trigger webhooks.
   * @returns Promise<WebhookEventsResponse>
   */
  async getEvents(): Promise<WebhookEventsResponse> {
    const response = await this.client.request<WebhookEventsResponse>("GET", "/webhooks");
    return webhookEventsResponseSchema.parse(response);
  }

  /**
   * List webhook triggers for a business.
   * @param businessId The business ID to list triggers for
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<WebhookTrigger>>
   */
  async listTriggers(
    businessId: string,
    params?: z.infer<typeof listTriggersSchemaOptions>
  ): Promise<PagedResponse<WebhookTrigger>> {
    const validatedParams = listTriggersSchema.parse({ businessId, ...params });
    const queryParams = new URLSearchParams();
    if (validatedParams.page != null) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.pageSize != null)
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    const queryString = queryParams.toString();
    const path = queryString
      ? `/business/${validatedParams.businessId}/webhooks/triggers?${queryString}`
      : `/business/${validatedParams.businessId}/webhooks/triggers`;
    const response = await this.client.request<PagedResponse<WebhookTrigger>>("GET", path);
    return webhookTriggerListSchema.parse(response);
  }

  /**
   * Create a new webhook trigger.
   * @param businessId The business ID to create the trigger for
   * @param params Trigger creation parameters
   * @returns Promise<WebhookTrigger>
   */
  async createTrigger(
    businessId: string,
    params: z.infer<typeof createTriggerSchemaOptions>
  ): Promise<WebhookTrigger> {
    const validatedParams = createTriggerSchema.parse({ businessId, ...params });
    const body: Record<string, unknown> = {
      endpointId: validatedParams.endpointId,
      eventNames: validatedParams.eventNames,
      transactionIds: validatedParams.transactionIds ?? [],
      name: validatedParams.name,
    };
    if (validatedParams.contractMethodIds != null)
      body.contractMethodIds = validatedParams.contractMethodIds;
    if (validatedParams.description != null) body.description = validatedParams.description;
    const response = await this.client.request<WebhookTrigger>(
      "POST",
      `/business/${validatedParams.businessId}/webhooks/triggers`,
      body
    );
    return webhookTriggerSchema.parse(response);
  }

  /**
   * Update an existing webhook trigger.
   * @param webhookTriggerId The trigger ID to update
   * @param params Update parameters
   * @returns Promise<WebhookTrigger>
   */
  async updateTrigger(
    webhookTriggerId: string,
    params: z.infer<typeof updateTriggerSchema>
  ): Promise<WebhookTrigger> {
    getTriggerSchema.parse({ webhookTriggerId });
    const body: Record<string, unknown> = {};
    if (params.endpointId !== undefined) body.endpointId = params.endpointId;
    if (params.eventNames !== undefined) body.eventNames = params.eventNames;
    if (params.contractMethodIds !== undefined) body.contractMethodIds = params.contractMethodIds;
    if (params.name !== undefined) body.name = params.name;
    if (params.description !== undefined) body.description = params.description;
    const response = await this.client.request<WebhookTrigger>(
      "PUT",
      `/webhooks/triggers/${webhookTriggerId}`,
      body
    );
    return webhookTriggerSchema.parse(response);
  }

  /**
   * Delete a webhook trigger.
   * @param webhookTriggerId The trigger ID to delete
   * @returns Promise<{ success: boolean }>
   */
  async deleteTrigger(webhookTriggerId: string): Promise<{ success: boolean }> {
    getTriggerSchema.parse({ webhookTriggerId });
    const response = await this.client.request<{ success: boolean }>(
      "DELETE",
      `/webhooks/triggers/${webhookTriggerId}`
    );
    return deleteTriggerResponseSchema.parse(response);
  }

  /**
   * List webhook endpoints for a business.
   * @param businessId The business ID to list endpoints for
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<WebhookEndpoint>>
   */
  async listEndpoints(
    businessId: string,
    params?: z.infer<typeof listEndpointsSchemaOptions>
  ): Promise<PagedResponse<WebhookEndpoint>> {
    const validatedParams = listEndpointsSchema.parse({ businessId, ...params });
    const queryParams = new URLSearchParams();
    if (validatedParams.page != null) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.pageSize != null)
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    const queryString = queryParams.toString();
    const path = queryString
      ? `/business/${validatedParams.businessId}/webhooks/endpoints?${queryString}`
      : `/business/${validatedParams.businessId}/webhooks/endpoints`;
    const response = await this.client.request<PagedResponse<WebhookEndpoint>>("GET", path);
    return webhookEndpointListSchema.parse(response);
  }

  /**
   * Create a new webhook endpoint.
   * @param businessId The business ID to create the endpoint for
   * @param params Endpoint creation parameters
   * @returns Promise<WebhookEndpoint>
   */
  async createEndpoint(
    businessId: string,
    params: z.infer<typeof createEndpointSchemaOptions>
  ): Promise<WebhookEndpoint> {
    const validatedParams = createEndpointSchema.parse({ businessId, ...params });
    const body: Record<string, unknown> = {
      destinationUrl: validatedParams.destinationUrl,
      name: validatedParams.name,
    };
    if (validatedParams.description != null) body.description = validatedParams.description;
    const response = await this.client.request<WebhookEndpoint>(
      "POST",
      `/business/${validatedParams.businessId}/webhooks/endpoints`,
      body
    );
    return webhookEndpointSchema.parse(response);
  }

  /**
   * Get a webhook endpoint by ID.
   * @param webhookEndpointId The endpoint ID
   * @returns Promise<WebhookEndpoint>
   */
  async getEndpoint(webhookEndpointId: string): Promise<WebhookEndpoint> {
    getEndpointSchema.parse({ webhookEndpointId });
    const response = await this.client.request<WebhookEndpoint>(
      "GET",
      `/webhooks/endpoints/${webhookEndpointId}`
    );
    return webhookEndpointSchema.parse(response);
  }

  /**
   * Update a webhook endpoint.
   * @param webhookEndpointId The endpoint ID to update
   * @param params Update parameters
   * @returns Promise<WebhookEndpoint>
   */
  async updateEndpoint(
    webhookEndpointId: string,
    params: z.infer<typeof updateEndpointSchema>
  ): Promise<WebhookEndpoint> {
    getEndpointSchema.parse({ webhookEndpointId });
    const body: Record<string, unknown> = {};
    if (params.name !== undefined) body.name = params.name;
    if (params.description !== undefined) body.description = params.description;
    const response = await this.client.request<WebhookEndpoint>(
      "PUT",
      `/webhooks/endpoints/${webhookEndpointId}`,
      body
    );
    return webhookEndpointSchema.parse(response);
  }

  /**
   * Delete a webhook endpoint.
   * @param webhookEndpointId The endpoint ID to delete
   * @returns Promise<{ success: boolean }>
   */
  async deleteEndpoint(webhookEndpointId: string): Promise<{ success: boolean }> {
    getEndpointSchema.parse({ webhookEndpointId });
    const response = await this.client.request<{ success: boolean }>(
      "DELETE",
      `/webhooks/endpoints/${webhookEndpointId}`
    );
    return deleteEndpointResponseSchema.parse(response);
  }

  /**
   * Rotate the private key for a webhook endpoint. Returns the endpoint with the new public key.
   * @param webhookEndpointId The endpoint ID to rotate
   * @returns Promise<WebhookEndpoint>
   */
  async rotateEndpointKey(webhookEndpointId: string): Promise<WebhookEndpoint> {
    getEndpointSchema.parse({ webhookEndpointId });
    const response = await this.client.request<WebhookEndpoint>(
      "PUT",
      `/webhooks/endpoints/${webhookEndpointId}/rotate`
    );
    return webhookEndpointSchema.parse(response);
  }

  /**
   * List generated webhooks for a particular endpoint.
   * @param webhookEndpointId The endpoint ID to list webhooks for
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<Webhook>>
   */
  async listWebhooksForEndpoint(
    webhookEndpointId: string,
    params?: z.infer<typeof listWebhooksForEndpointSchemaOptions>
  ): Promise<PagedResponse<Webhook>> {
    const validatedParams = listWebhooksForEndpointSchema.parse({
      webhookEndpointId,
      ...params,
    });
    const queryParams = new URLSearchParams();
    if (validatedParams.page != null) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.pageSize != null)
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    const queryString = queryParams.toString();
    const path = queryString
      ? `/webhooks/endpoints/${validatedParams.webhookEndpointId}/webhooks?${queryString}`
      : `/webhooks/endpoints/${validatedParams.webhookEndpointId}/webhooks`;
    const response = await this.client.request<PagedResponse<Webhook>>("GET", path);
    return webhookListSchema.parse(response);
  }

  /**
   * List delivery attempts for a particular webhook.
   * @param webhookId The webhook ID to list attempts for
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<WebhookDeliveryAttempt>>
   */
  async listDeliveryAttempts(
    webhookId: string,
    params?: z.infer<typeof listDeliveryAttemptsSchemaOptions>
  ): Promise<PagedResponse<WebhookDeliveryAttempt>> {
    const validatedParams = listDeliveryAttemptsSchema.parse({ webhookId, ...params });
    const queryParams = new URLSearchParams();
    if (validatedParams.page != null) queryParams.append("page", validatedParams.page.toString());
    if (validatedParams.pageSize != null)
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    const queryString = queryParams.toString();
    const path = queryString
      ? `/webhooks/${validatedParams.webhookId}/attempts?${queryString}`
      : `/webhooks/${validatedParams.webhookId}/attempts`;
    const response = await this.client.request<PagedResponse<WebhookDeliveryAttempt>>("GET", path);
    return webhookDeliveryAttemptListSchema.parse(response);
  }
}
