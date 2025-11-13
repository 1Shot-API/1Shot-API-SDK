import { z } from "zod";

import { IOneShotClient } from "../types/client.js";
import { PagedResponse } from "../types/common.js";
import {
  ContractEvent,
  UpdateContractEvent,
  SearchContractEventLogs,
  ContractEventSearchResult,
} from "../types/contractEvent.js";
import {
  contractEventSchema,
  contractEventListSchema,
  createContractEventSchema,
  listContractEventsSchema,
  getContractEventSchema,
  updateContractEventSchema,
  deleteContractEventSchema,
  searchContractEventLogsSchema,
  contractEventSearchResultSchema,
} from "../validation/contractEvent.js";

const listContractEventsSchemaOptions = listContractEventsSchema.omit({
  businessId: true,
});

const createContractEventSchemaOptions = createContractEventSchema.omit({
  businessId: true,
});

export class ContractEvents {
  constructor(private client: IOneShotClient) {}

  /**
   * Create a new contract event definition for monitoring blockchain events
   * @param businessId The business ID that owns this event definition
   * @param params Contract event creation parameters
   * @returns Promise<ContractEvent>
   * @throws {ZodError} If the parameters are invalid
   */
  async create(
    businessId: string,
    params: z.infer<typeof createContractEventSchemaOptions>
  ): Promise<ContractEvent> {
    const validatedParams = createContractEventSchema.parse({
      businessId,
      ...params,
    });

    const response = await this.client.request<ContractEvent>(
      "POST",
      `/business/${validatedParams.businessId}/events`,
      validatedParams
    );

    return contractEventSchema.parse(response);
  }

  /**
   * List contract event definitions for a business with optional filtering
   * @param businessId The business ID to list events for
   * @param params Optional filtering and pagination parameters
   * @returns Promise<PagedResponse<ContractEvent>>
   * @throws {ZodError} If the parameters are invalid
   */
  async list(
    businessId: string,
    params?: z.infer<typeof listContractEventsSchemaOptions>
  ): Promise<PagedResponse<ContractEvent>> {
    const validatedParams = listContractEventsSchema.parse({
      businessId,
      ...params,
    });

    const queryParams = new URLSearchParams();
    if (validatedParams.pageSize !== undefined && validatedParams.pageSize !== null) {
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    }
    if (validatedParams.page !== undefined && validatedParams.page !== null) {
      queryParams.append("page", validatedParams.page.toString());
    }
    if (validatedParams.chainId !== undefined && validatedParams.chainId !== null) {
      queryParams.append("chainId", validatedParams.chainId.toString());
    }
    if (validatedParams.name !== undefined && validatedParams.name !== null) {
      queryParams.append("name", validatedParams.name);
    }
    if (validatedParams.status !== undefined && validatedParams.status !== null) {
      queryParams.append("status", validatedParams.status);
    }
    if (validatedParams.contractAddress !== undefined && validatedParams.contractAddress !== null) {
      queryParams.append("contractAddress", validatedParams.contractAddress);
    }
    if (validatedParams.eventName !== undefined && validatedParams.eventName !== null) {
      queryParams.append("eventName", validatedParams.eventName);
    }

    const queryString = queryParams.toString();
    const path = queryString
      ? `/business/${validatedParams.businessId}/events?${queryString}`
      : `/business/${validatedParams.businessId}/events`;

    const response = await this.client.request<PagedResponse<ContractEvent>>("GET", path);

    return contractEventListSchema.parse(response);
  }

  /**
   * Get a specific contract event definition by ID
   * @param contractEventId The ID of the contract event to retrieve
   * @returns Promise<ContractEvent>
   * @throws {ZodError} If the parameters are invalid
   */
  async get(contractEventId: string): Promise<ContractEvent> {
    const validatedParams = getContractEventSchema.parse({ contractEventId });

    const response = await this.client.request<ContractEvent>(
      "GET",
      `/events/${validatedParams.contractEventId}`
    );

    return contractEventSchema.parse(response);
  }

  /**
   * Update an existing contract event definition
   * @param contractEventId The ID of the contract event to update
   * @param params Update parameters
   * @returns Promise<ContractEvent>
   * @throws {ZodError} If the parameters are invalid
   */
  async update(contractEventId: string, params: UpdateContractEvent): Promise<ContractEvent> {
    const validatedParams = updateContractEventSchema.parse(params);

    const response = await this.client.request<ContractEvent>(
      "PUT",
      `/events/${contractEventId}`,
      validatedParams
    );

    return contractEventSchema.parse(response);
  }

  /**
   * Delete a contract event definition
   * @param contractEventId The ID of the contract event to delete
   * @returns Promise<{ success: boolean }>
   * @throws {ZodError} If the parameters are invalid
   */
  async delete(contractEventId: string): Promise<{ success: boolean }> {
    const validatedParams = deleteContractEventSchema.parse({ contractEventId });

    const response = await this.client.request<{ success: boolean }>(
      "DELETE",
      `/events/${validatedParams.contractEventId}`
    );

    return response;
  }

  /**
   * Search contract event logs from the blockchain for the specified event definition
   * @param contractEventId The ID of the contract event to search logs for
   * @param params Optional search parameters
   * @returns Promise<ContractEventSearchResult>
   * @throws {ZodError} If the parameters are invalid
   */
  async searchLogs(
    contractEventId: string,
    params?: SearchContractEventLogs
  ): Promise<ContractEventSearchResult> {
    const validatedParams = searchContractEventLogsSchema.parse(params || {});

    const response = await this.client.request<ContractEventSearchResult>(
      "POST",
      `/events/${contractEventId}/search`,
      validatedParams
    );

    return contractEventSearchResultSchema.parse(response);
  }
}
