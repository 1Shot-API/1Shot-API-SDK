import { z } from "zod";

import {
  topicSchema,
  contractEventLogSchema,
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

/**
 * Represents a topic parameter for a contract event.
 */
export type Topic = z.infer<typeof topicSchema>;

/**
 * Represents a contract event log from the blockchain.
 */
export type ContractEventLog = z.infer<typeof contractEventLogSchema>;

/**
 * Represents a contract event definition for monitoring blockchain events.
 */
export type ContractEvent = z.infer<typeof contractEventSchema>;

/**
 * Represents a paginated list of contract events.
 */
export type ContractEventList = z.infer<typeof contractEventListSchema>;

/**
 * Parameters for creating a new contract event definition.
 */
export type CreateContractEvent = z.infer<typeof createContractEventSchema>;

/**
 * Parameters for listing contract events.
 */
export type ListContractEvents = z.infer<typeof listContractEventsSchema>;

/**
 * Parameters for getting a contract event.
 */
export type GetContractEvent = z.infer<typeof getContractEventSchema>;

/**
 * Parameters for updating a contract event.
 */
export type UpdateContractEvent = z.infer<typeof updateContractEventSchema>;

/**
 * Parameters for deleting a contract event.
 */
export type DeleteContractEvent = z.infer<typeof deleteContractEventSchema>;

/**
 * Parameters for searching contract event logs.
 */
export type SearchContractEventLogs = z.infer<typeof searchContractEventLogsSchema>;

/**
 * Results from searching contract event logs.
 */
export type ContractEventSearchResult = z.infer<typeof contractEventSearchResultSchema>;
