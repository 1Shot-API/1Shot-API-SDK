import { z } from "zod";

// Validation for log description
export const logDescriptionSchema = z
  .object({
    name: z.string().describe("Name of the log event"),
    signature: z.string().describe("Signature of the log event"),
    topic: z.string().describe("Topic of the log event"),
    args: z
      .lazy(() => z.array(z.union([z.string(), logDescriptionArgsSchema])))
      .describe("Arguments of the log event - can be strings or nested arrays of strings"),
  })
  .describe("A description of a log event");

// Recursive schema for log description args
export const logDescriptionArgsSchema: z.ZodType<string | Array<string | any>> = z.lazy(() =>
  z.union([z.string(), z.array(z.union([z.string(), logDescriptionArgsSchema]))])
);

// Validation for transaction status
export const transactionStatusSchema = z
  .enum(["Submitted", "Completed", "Retrying", "Failed", "Pending"])
  .describe(
    "The current status of a transaction. Tracks the lifecycle of a transaction from submission to completion or failure. Used for monitoring and error handling"
  );

// Validation for transaction
export const transactionSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe(
        "Internal ID of the transaction. Unique identifier for tracking the execution lifecycle"
      ),
    contractMethodIds: z
      .array(z.string().uuid())
      .describe(
        "ID of the Contract Method being executed. Links to the Contract Method definition that was executed"
      ),
    apiCredentialId: z
      .string()
      .uuid()
      .nullable()
      .describe(
        "ID of the API credential used for execution, if any. Identifies which API key was used to execute the transaction. Will be null if executed by a user"
      ),
    apiKey: z
      .string()
      .nullable()
      .describe(
        "API key used for execution, if any. The actual API key that was used. Will be null if executed by a user"
      ),
    userId: z
      .string()
      .uuid()
      .nullable()
      .describe(
        "ID of the user who initiated the execution, if any. Identifies which user executed the transaction. Will be null if executed via API"
      ),
    status: transactionStatusSchema,
    transactionHash: z
      .string()
      .nullable()
      .describe(
        "Hash of the transaction on the blockchain, if available. The actual blockchain transaction hash. Only available after status is Submitted"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that was called in this transaction"),
    name: z
      .string()
      .describe(
        "Name of the transaction being executed. Included for convenience and display purposes"
      ),
    functionName: z
      .string()
      .describe("Name of the function being called. Included for convenience and display purposes"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "ID of the blockchain network where the transaction is executed. Determines which blockchain the transaction was sent to"
      ),
    memo: z
      .string()
      .nullable()
      .describe(
        "Optional memo or note about the transaction. Can contain user-provided text or formatted data about why the execution was done"
      ),
    completed: z
      .number()
      .nullable()
      .describe(
        "Unix timestamp when the execution completed, if applicable. Used for tracking execution duration and timing"
      ),
    walletId: z.string().uuid().describe("ID of the wallet that executed the transaction"),
    failureReason: z
      .string()
      .nullable()
      .describe("The reason the transaction failed. This is only set if the transaction failed"),
    from: z.string().describe("The address of the account that sent the transaction"),
    to: z.string().nullable().describe("The address of the account that received the transaction"),
    gasPrice: z.string().nullable().describe("The gas price of the transaction"),
    gasLimit: z.string().nullable().describe("The gas limit of the transaction"),
    maxFeePerGas: z.string().nullable().describe("The max fee per gas of the transaction"),
    maxPriorityFeePerGas: z
      .string()
      .nullable()
      .describe("The max priority fee per gas of the transaction"),
    gasUsed: z.string().nullable().describe("The gas used by the transaction"),
    logs: z
      .array(logDescriptionSchema)
      .nullable()
      .describe("The logs, if any, emitted by the transaction"),
    updated: z
      .number()
      .describe("Unix timestamp of the last update to this execution. Used for tracking changes"),
    created: z
      .number()
      .describe("Unix timestamp when this execution was created. Used for tracking creation time"),
    deleted: z
      .boolean()
      .describe("Whether this execution has been deleted. Used for soft deletion and filtering"),
  })
  .describe(
    "A record of a transaction attempt. Represents a single execution of a transaction on the blockchain, including its status, parameters, and results. Used for tracking and monitoring transaction lifecycle"
  );

// Validation for transaction list response
export const transactionListSchema = z
  .object({
    response: z
      .array(transactionSchema)
      .describe("List of transaction executions matching the query parameters"),
    page: z
      .number()
      .int()
      .positive()
      .describe("Current page number in the paginated results (1-indexed)"),
    pageSize: z
      .number()
      .int()
      .positive()
      .describe("Number of items per page. Determines how many executions are returned"),
    totalResults: z
      .number()
      .int()
      .nonnegative()
      .describe("Total number of results available across all pages"),
  })
  .describe(
    "Paginated list of transaction executions. Used for retrieving multiple transaction executions with pagination support"
  );

// Validation for get transaction parameters
export const getTransactionSchema = z
  .object({
    transactionId: z
      .string()
      .uuid()
      .describe(
        "Execution ID of the specific transaction to retrieve. Identifies which execution to fetch"
      ),
  })
  .describe(
    "Parameters for retrieving a specific transaction. Used to get detailed information about a single execution"
  );

// Validation for list transaction executions parameters
export const listTransactionsSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe("ID of the business to list executions for. Used for access control and filtering"),
    pageSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Number of items per page. Optional parameter for pagination control"),
    page: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Page number to retrieve (1-indexed). Optional parameter for pagination control"),
    chainId: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe(
        "Filter executions by blockchain network ID. Optional parameter to get executions for a specific chainId"
      ),
    status: z
      .enum(["Pending", "Submitted", "Completed", "Retrying", "Failed"])
      .optional()
      .nullable()
      .describe("Filter executions by status. Optional parameter to filter by execution state"),
    walletId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "Filter executions by wallet ID. Optional parameter to get executions for a specific wallet"
      ),
    contractMethodId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "Filter executions by contract method ID. Optional parameter to get executions of a specific contract method"
      ),
    apiCredentialId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "Filter executions by API credential ID. Optional parameter to get executions made with a specific API key"
      ),
    userId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "Filter executions by user ID. Optional parameter to get executions made by a specific user"
      ),
    memo: z
      .string()
      .optional()
      .nullable()
      .describe("Filter executions by memo text. Optional parameter to search for specific memos"),
    createdAfter: z
      .number()
      .optional()
      .nullable()
      .describe(
        "Filter executions created after this timestamp. Optional parameter for time-based filtering"
      ),
    createdBefore: z
      .number()
      .optional()
      .nullable()
      .describe(
        "Filter executions created before this timestamp. Optional parameter for time-based filtering"
      ),
  })
  .describe(
    "Parameters for listing transaction executions. Used to filter and paginate execution lists with various criteria"
  );
