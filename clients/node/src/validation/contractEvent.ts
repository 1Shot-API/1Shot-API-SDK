import { z } from 'zod';

// Validation for topic information
export const topicSchema = z
  .object({
    name: z.string().describe('Name of the event parameter'),
    indexed: z.boolean().describe('Whether this parameter is indexed in the event'),
  })
  .describe('A topic parameter for a contract event');

// Validation for contract event log
export const contractEventLogSchema = z
  .object({
    eventName: z.string().describe('Name of the event that was emitted'),
    blockNumber: z.number().int().describe('Block number where the event was emitted'),
    transactionHash: z.string().describe('Hash of the transaction that emitted the event'),
    logIndex: z.number().int().describe('Index of the log within the transaction'),
    removed: z.boolean().describe('Whether this log was removed due to chain reorganization'),
    topics: z.record(z.string()).describe('Decoded event arguments by parameter name'),
  })
  .describe('A contract event log from the blockchain');

// Validation for contract event
export const contractEventSchema = z
  .object({
    id: z.string().uuid().describe('The unique identifier for a contract event definition'),
    businessId: z.string().uuid().describe('The business ID that owns this event definition'),
    chainId: z.number().int().describe('The chain ID where this event is monitored'),
    contractAddress: z.string().describe('The contract address where this event is monitored'),
    name: z.string().describe('Human-readable name for the event definition'),
    description: z.string().describe('Description of what this event represents'),
    eventName: z.string().describe('The exact name of the event as defined in the contract ABI'),
    topicHash: z.string().describe('The keccak256 hash of the event signature'),
    topics: z.array(topicSchema).describe('Array of event parameter definitions'),
    updated: z.number().int().describe('Unix timestamp when the event definition was last updated'),
    created: z.number().int().describe('Unix timestamp when the event definition was created'),
  })
  .describe('A contract event definition for monitoring blockchain events');

// Validation for contract event list
export const contractEventListSchema = z
  .object({
    response: z.array(contractEventSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalResults: z.number().int().nonnegative(),
  })
  .describe('Paginated list of contract events');

// Validation for creating a contract event
export const createContractEventSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe(
        'The business ID to create the contract event for. Used for access control and organization'
      ),
    chainId: z.number().int().describe('The chain ID where this event should be monitored'),
    contractAddress: z
      .string()
      .describe('The contract address where this event should be monitored'),
    name: z.string().describe('A human-readable name for this event definition'),
    description: z.string().describe('A description of what this event represents'),
    eventName: z.string().describe('The exact name of the event as defined in the contract ABI'),
  })
  .describe('Parameters for creating a new contract event definition');

// Validation for listing contract events
export const listContractEventsSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe(
        'The business ID to list contract events for. Used for access control and filtering'
      ),
    pageSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe('Number of items per page'),
    page: z.number().int().positive().optional().nullable().describe('Page number to retrieve'),
    chainId: z.number().int().optional().nullable().describe('Filter by chain ID'),
    name: z.string().optional().nullable().describe('Filter by event definition name'),
    status: z
      .enum(['active', 'deleted', 'all'])
      .optional()
      .nullable()
      .describe('Filter by deletion status'),
    contractAddress: z.string().optional().nullable().describe('Filter by contract address'),
    eventName: z.string().optional().nullable().describe('Filter by contract event name'),
  })
  .describe('Parameters for listing contract events');

// Validation for getting a contract event
export const getContractEventSchema = z
  .object({
    contractEventId: z.string().uuid().describe('The ID of the contract event to retrieve'),
  })
  .describe('Parameters for getting a contract event');

// Validation for updating a contract event
export const updateContractEventSchema = z
  .object({
    name: z.string().optional().describe('Updated name for the event definition'),
    description: z.string().optional().describe('Updated description for the event definition'),
  })
  .describe('Parameters for updating a contract event');

// Validation for deleting a contract event
export const deleteContractEventSchema = z
  .object({
    contractEventId: z.string().uuid().describe('The ID of the contract event to delete'),
  })
  .describe('Parameters for deleting a contract event');

// Validation for searching contract event logs
export const searchContractEventLogsSchema = z
  .object({
    startBlock: z
      .number()
      .int()
      .optional()
      .nullable()
      .describe('Starting block number to search from'),
    endBlock: z.number().int().optional().nullable().describe('Ending block number to search to'),
    topics: z
      .record(z.string())
      .optional()
      .nullable()
      .describe('Filter by indexed event parameters'),
  })
  .describe('Parameters for searching contract event logs');

// Validation for contract event search results
export const contractEventSearchResultSchema = z
  .object({
    logs: z.array(contractEventLogSchema).describe('Array of contract event logs found'),
    error: z.string().optional().nullable().describe('The error message from the API'),
    maxResults: z
      .number()
      .int()
      .optional()
      .nullable()
      .describe('The maximum number of results returned by the API'),
    startBlock: z
      .number()
      .int()
      .optional()
      .nullable()
      .describe('The recommended starting block number in case of excessive results'),
    endBlock: z
      .number()
      .int()
      .optional()
      .nullable()
      .describe('The recommended ending block number in case of excessive results'),
  })
  .describe('Results from searching contract event logs');
