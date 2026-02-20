import { z } from "zod";

// Validation for account balance details
export const accountBalanceDetailsSchema = z
  .object({
    type: z
      .number()
      .int()
      .refine((val) => val === 0, {
        message: "Type must be 0 (EVM)",
      })
      .describe("The technology of the chain. 1Shot currently only supports EVM (0) chains"),
    ticker: z.string().describe("Symbol of the token"),
    chainId: z.number().int().positive().describe("ID of the blockchain network"),
    tokenAddress: z.string().describe("Address of the token contract (empty for native currency)"),
    accountAddress: z.string().describe("Address of the wallet account"),
    balance: z.string().describe("Current balance of the token in the wallet"),
    decimals: z.number().int().nonnegative().describe("Number of decimal places for the token"),
  })
  .describe("Details about a token balance in a wallet");

// Validation for wallet
export const walletSchema = z
  .object({
    id: z.string().uuid().describe("Internal ID of the wallet"),
    accountAddress: z.string().describe("Blockchain address of the wallet"),
    businessId: z
      .string()
      .uuid()
      .nullable()
      .describe("ID of the business that owns this wallet, if any"),
    userId: z.string().uuid().nullable().describe("ID of the user who owns this wallet, if any"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe("ID of the blockchain network where this wallet exists"),
    name: z.string().describe("Name of the wallet"),
    description: z.string().describe("Description of the wallet"),
    isAdmin: z.boolean().describe("Whether this is an admin wallet with special privileges"),
    accountBalanceDetails: accountBalanceDetailsSchema
      .nullable()
      .describe("Current balance details of the wallet"),
    erc7702ContractAddress: z
      .string()
      .nullable()
      .describe("Address of the ERC-7702 contract that the Wallet has been upgraded to"),
    updated: z.number().describe("Unix timestamp of the last update to this wallet"),
    created: z.number().describe("Unix timestamp when this wallet was created"),
  })
  .describe("A wallet that can hold and manage funds");

// Validation for wallet list response
export const walletListSchema = z
  .object({
    response: z.array(walletSchema).describe("List of wallets"),
    page: z.number().int().positive().describe("Current page number in the paginated results"),
    pageSize: z.number().int().positive().describe("Number of items per page"),
    totalResults: z
      .number()
      .int()
      .nonnegative()
      .describe("Total number of results across all pages"),
  })
  .describe("Paginated list of wallets");

// Validation for wallet update parameters
export const walletUpdateSchema = z
  .object({
    name: z.string().optional().nullable().describe("New name for the wallet"),
    description: z.string().optional().nullable().describe("New description for the wallet"),
  })
  .describe("Parameters for updating a wallet");

// Validation for wallet creation parameters
export const walletCreateSchema = z
  .object({
    chainId: z
      .number()
      .int()
      .positive()
      .describe("ID of the blockchain network where the wallet will be created"),
    name: z.string().describe("Name for the new wallet"),
    description: z.string().optional().nullable().describe("Description for the new wallet"),
  })
  .describe("Parameters for creating a new wallet");

// Validation for list wallets parameters
export const listWalletsSchema = z
  .object({
    businessId: z.string().uuid().describe("ID of the business to list wallets for"),
    chainId: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Filter wallets by blockchain network ID"),
    pageSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Number of items per page"),
    page: z.number().int().positive().optional().nullable().describe("Page number to retrieve"),
    name: z.string().optional().nullable().describe("Filter wallets by name"),
  })
  .describe("Parameters for listing wallets");

// Validation for create wallet parameters
export const createWalletSchema = z
  .object({
    businessId: z.string().uuid().describe("ID of the business to create the wallet for"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe("ID of the blockchain network where the wallet will be created"),
    name: z.string().describe("Name for the new wallet"),
    description: z.string().optional().nullable().describe("Description for the new wallet"),
  })
  .describe("Parameters for creating a new wallet");

// Validation for get wallet parameters
export const getWalletSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to retrieve"),
    includeBalances: z
      .boolean()
      .optional()
      .nullable()
      .describe("Whether to include balance information in the response"),
  })
  .describe("Parameters for retrieving a wallet");

// Validation for update wallet parameters
export const updateWalletSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to update"),
    name: z.string().optional().nullable().describe("New name for the wallet"),
    description: z.string().optional().nullable().describe("New description for the wallet"),
  })
  .describe("Parameters for updating a wallet");

// Validation for delete wallet parameters
export const deleteWalletSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to delete"),
  })
  .describe("Parameters for deleting a wallet");

// Validation for wallet transfer parameters
export const transferWalletSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to transfer funds from"),
    destinationAccountAddress: z.string().describe("The destination address to transfer funds to"),
    transferAmount: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to transfer. If omitted, 1Shot API will calculate the maximum amount that can be transferred, getting as close to zeroing out the wallet as possible"
      ),
    memo: z.string().optional().describe("An optional memo for the transfer"),
  })
  .describe("Parameters for transferring native tokens from a wallet");

// Validation for delegation
export const delegationSchema = z
  .object({
    id: z.string().uuid().describe("Internal ID of the delegation"),
    businessId: z.string().uuid().describe("ID of the business that owns this delegation"),
    escrowWalletId: z
      .string()
      .uuid()
      .describe("ID of the escrow wallet that can execute transactions"),
    delegatorAddress: z.string().describe("The address of the delegator account"),
    startTime: z
      .number()
      .nullable()
      .describe("The start time for the delegation. If null, the delegation starts immediately"),
    endTime: z
      .number()
      .nullable()
      .describe("The end time for the delegation. If null, the delegation has no expiration"),
    contractAddresses: z
      .array(z.string())
      .optional()
      .nullable()
      .describe("Array of contract addresses that the wallet can execute transactions for"),
    methods: z
      .array(z.string())
      .optional()
      .nullable()
      .describe(
        "Array of method names that the wallet can execute. If empty, all methods are allowed"
      ),
    delegationData: z.string().describe("The actual Delegation object serialized as a JSON string"),
    updated: z.number().describe("Unix timestamp of the last update to this delegation"),
    created: z.number().describe("Unix timestamp when this delegation was created"),
  })
  .describe(
    "A delegation allows a wallet to execute transactions on behalf of specified contract addresses and methods"
  );

// Validation for delegation list response
export const delegationListSchema = z
  .object({
    response: z.array(delegationSchema).describe("List of delegations"),
    page: z.number().int().positive().describe("Current page number in the paginated results"),
    pageSize: z.number().int().positive().describe("Number of items per page"),
    totalResults: z
      .number()
      .int()
      .nonnegative()
      .describe("Total number of results across all pages"),
  })
  .describe("Paginated list of delegations");

// Validation for list delegations parameters
export const listDelegationsSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to list delegations for"),
    pageSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Number of items per page"),
    page: z.number().int().positive().optional().nullable().describe("Page number to retrieve"),
  })
  .describe("Parameters for listing delegations for a wallet");

// Validation for create delegation parameters
export const createDelegationSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to create the delegation for"),
    startTime: z
      .number()
      .optional()
      .nullable()
      .describe(
        "The start time for the delegation. If not provided, the delegation starts immediately"
      ),
    endTime: z
      .number()
      .optional()
      .nullable()
      .describe(
        "The end time for the delegation. If not provided, the delegation has no expiration"
      ),
    contractAddresses: z
      .array(z.string())
      .optional()
      .nullable()
      .describe(
        "Array of contract addresses that the wallet can execute transactions for. Leave this empty to allow all contracts"
      ),
    methods: z
      .array(z.string())
      .optional()
      .nullable()
      .describe(
        "Array of method names that the wallet can execute. If empty, all methods are allowed"
      ),
    delegationData: z
      .string()
      .describe(
        "The actual Delegation object serialized as a JSON string. BigInts must be encoded as strings"
      ),
  })
  .describe("Parameters for creating a new delegation for a wallet");

// Validation for delete delegation parameters
export const deleteDelegationSchema = z
  .object({
    delegationId: z.string().uuid().describe("ID of the delegation to delete"),
  })
  .describe("Parameters for deleting a delegation");

// Validation for get signature parameters
export const getSignatureSchema = z
  .object({
    walletId: z.string().uuid().describe("ID of the wallet to get a signature from"),
    type: z
      .enum(["erc3009", "permit2"])
      .describe("The type of signature to get. Currently, only erc3009 and permit2 are supported"),
    contractAddress: z
      .string()
      .describe(
        "The contract address of the token that you are getting a signature for, such as USDC"
      ),
    destinationAddress: z
      .string()
      .describe(
        "The address of the destination that the transfer will be sent to, such as a user's wallet address or another contract"
      ),
    amount: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of the token to transfer. This is in Wei, and depends on the number of decimals of the token. Make sure you know the details of the token you are transferring!"
      ),
    validUntil: z
      .number()
      .optional()
      .nullable()
      .describe(
        "The timestamp until which the signature is valid. This is in seconds since the Unix epoch. For Permit2 signatures, this is the 'deadline' value"
      ),
    validAfter: z
      .number()
      .optional()
      .nullable()
      .describe(
        "The timestamp after which the signature is valid. This is in seconds since the Unix epoch. This is used for Permit2 signatures and will produce an error if it is provided for ERC-3009"
      ),
    fromAddress: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Optional. When set, the ERC-3009 authorization is created with this address as the 'from' (token holder) instead of the server wallet. The server wallet still signs on behalf of this address. Only applicable for erc3009 signature type; ignored for permit2"
      ),
  })
  .describe("Parameters for getting a signature from a wallet");

// Validation for signature response
export const signatureResponseSchema = z
  .object({
    signature: z.string().describe("The signature of the transfer"),
    data: z.string().describe("The actual data that was signed"),
  })
  .describe("The signature and the data that was signed");
