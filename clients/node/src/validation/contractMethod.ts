import { z } from "zod";
import { newSolidityStructParamSchema, solidityStructParamSchema } from "./struct.js";
import { ethereumAbiSchema } from "./abi.js";

// Validation for contractMethod state mutability
export const contractMethodStateMutabilitySchema = z
  .enum(["nonpayable", "payable", "view", "pure"])
  .describe(
    "The state mutability of a Solidity function. Determines if the function can modify state, receive native tokens, or only read data"
  );

// Validation for contractMethod status
export const contractMethodStatusSchema = z
  .enum(["live", "archived", "both"])
  .describe(
    "The status of a contractMethod - live for active contractMethods, archived for deleted ones, or both. Used for filtering contractMethod lists"
  );

// Validation for contractMethod parameters
/**
 * Schema for contractMethod parameters. This is a recursive schema that can handle nested objects and arrays.
 */
export const contractMethodParamsSchema: z.ZodType<{
  [key: string]: string | number | boolean | null | undefined | { [key: string]: any } | Array<any>;
}> = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
    z.lazy(() => contractMethodParamsSchema),
    z.array(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
        z.undefined(),
        z.lazy(() => contractMethodParamsSchema),
      ])
    ),
  ])
);

// Validation for contractMethod estimate
export const contractMethodEstimateSchema = z
  .object({
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Determines which blockchain network the contractMethod will be executed on"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that contains the function to be called"),
    functionName: z
      .string()
      .describe("The name of the function on the contract that will be called"),
    gasAmount: z
      .string()
      .describe("The estimated amount of gas units the contractMethod will consume"),
    maxFeePerGas: z
      .string()
      .nullable()
      .describe("The maximum fee per gas unit for EIP-1559 contractMethods"),
    maxPriorityFeePerGas: z
      .string()
      .nullable()
      .describe("The maximum priority fee per gas unit for EIP-1559 contractMethods"),
    gasPrice: z.string().nullable().describe("The gas price for legacy contractMethods"),
  })
  .describe(
    "A summary of values required to estimate the cost of executing a contractMethod. Used to determine gas fees and contractMethod costs before execution"
  );

// Validation for contractMethod update parameters
export const contractMethodUpdateSchema = z
  .object({
    chainId: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Can be updated to change which blockchain network the contractMethod operates on"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The address of the smart contract. Can be updated to point to a different contract"
      ),
    walletId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "The ID of the wallet that will execute the contractMethod. Must be for the same chainId as the contractMethod"
      ),
    name: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Name of contractMethod, used for display purposes and lookup. Helps identify the contractMethod in lists and logs"
      ),
    description: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Description of contractMethod, including details about what it does and when it should be called. Useful for documentation and understanding contractMethod purpose"
      ),
    functionName: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The actual method name on the smart contract. Solidity names are case sensitive and must match precisely. Cannot be changed after creation"
      ),
    stateMutability: contractMethodStateMutabilitySchema
      .optional()
      .nullable()
      .describe(
        "The state mutability of the Solidity function. Determines if the function can modify state, receive native tokens, or only read data"
      ),
    callbackUrl: z
      .string()
      .url()
      .nullable()
      .optional()
      .describe(
        "The URL to send webhooks to when this contractMethod is executed. Must be a valid HTTP or HTTPS URL with protocol. Used for contractMethod status notifications"
      ),
  })
  .describe(
    "Parameters that can be updated for an existing contractMethod. Allows modification of contractMethod properties while maintaining its core functionality"
  );

// Validation for contractMethod
export const contractMethodSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe(
        "Internal ID of the contractMethod object. Unique identifier for the contractMethod"
      ),
    businessId: z
      .string()
      .uuid()
      .describe(
        "The business that owns this contractMethod. Used for access control and organization"
      ),
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Determines which blockchain network the contractMethod operates on"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that contains the function to be called"),
    walletId: z
      .string()
      .uuid()
      .describe(
        "The default escrow wallet that will execute this ContractMethod. Must be for the same chainId as the contractMethod"
      ),
    name: z
      .string()
      .describe(
        "Name of contractMethod, used for display purposes and lookup. Helps identify the contractMethod in lists and logs"
      ),
    description: z
      .string()
      .describe(
        "Description of contractMethod, including details about what it does and when it should be called. Useful for documentation and understanding contractMethod purpose"
      ),
    functionName: z
      .string()
      .describe(
        "The actual method name on the smart contract. Solidity names are case sensitive and must match precisely. Defines which function will be called"
      ),
    inputs: z
      .array(solidityStructParamSchema)
      .describe(
        "The input parameters for the contractMethod function. Defines the structure and types of parameters required for execution"
      ),
    outputs: z
      .array(solidityStructParamSchema)
      .describe(
        "The output parameters for the contractMethod function. Defines the structure and types of values returned after execution"
      ),
    stateMutability: contractMethodStateMutabilitySchema,
    promptId: z
      .string()
      .uuid()
      .nullable()
      .describe(
        "The ID of the Prompt that this contractMethod was created from. This is optional, and a ContractMethod can drift from the original Prompt but retain this association"
      ),
    callbackUrl: z
      .string()
      .url()
      .nullable()
      .describe(
        "The current destination for webhooks to be sent when this contractMethod is executed. Will be null if no webhook is assigned. Used for contractMethod status notifications"
      ),
    publicKey: z
      .string()
      .base64()
      .nullable()
      .describe(
        "The current public key for verifying the integrity of the webhook when this contractMethod is executed. 1Shot will sign its webhooks with a private key and provide a signature for the webhook that can be validated with this key. It will be null if there is no webhook destination specified"
      ),
    updated: z
      .number()
      .describe(
        "Unix timestamp of when the contractMethod was last updated. Used for tracking changes"
      ),
    created: z
      .number()
      .describe(
        "Unix timestamp of when the contractMethod was created. Used for tracking creation time"
      ),
  })
  .describe(
    "A single defined contractMethod, corresponding a method call on a smart contract on a chainId. You can have multiple ContractMethods defined for the same method in the contract if you want to use different setups for static parameters. ContractMethods are sometimes referred to as Endpoints"
  );

// Validation for contractMethod list response
export const contractMethodListSchema = z
  .object({
    response: z
      .array(contractMethodSchema)
      .describe("The list of contractMethods matching the query parameters"),
    page: z
      .number()
      .int()
      .positive()
      .describe("Which page of results this is (1-indexed). Used for pagination"),
    pageSize: z
      .number()
      .int()
      .positive()
      .describe("The number of results per page. Determines how many contractMethods are returned"),
    totalResults: z
      .number()
      .int()
      .nonnegative()
      .describe("The total number of results available across all pages"),
  })
  .describe(
    "A paginated list of contractMethods. Used for retrieving multiple contractMethods with pagination support"
  );

// Validation for listing contractMethods
export const listContractMethodsSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe(
        "The business ID to list contractMethods for. Used for access control and filtering"
      ),
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
      .describe("Page number (1-indexed). Optional parameter for pagination control"),
    chainId: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe(
        "Filter by chainId ID. Optional parameter to get contractMethods for a specific blockchain"
      ),
    name: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Filter by contractMethod name. Optional parameter for searching contractMethods by name"
      ),
    status: z
      .enum(["live", "archived", "both"])
      .optional()
      .nullable()
      .describe(
        "Filter by contractMethod status - live for active contractMethods, archived for deleted ones, or both. Optional parameter for filtering by status"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Filter by contract address. Optional parameter to get contractMethods for a specific contract"
      ),
    promptId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "Filter by contract description ID. If provided, only contractMethods created from this Contract Description will be returned"
      ),
    methodType: z
      .enum(["read", "write"])
      .optional()
      .nullable()
      .describe(
        "Which type of contract method you want to filter by - read or write methods. If not provided, all contract methods will be returned"
      ),
  })
  .describe(
    "Parameters for listing contractMethods. Used to filter and paginate contractMethod lists"
  );

// Validation for ERC7702Authorization
export const erc7702AuthorizationSchema = z
  .object({
    address: z
      .string()
      .describe("The contract address that is being authorized to act on behalf of the EOA"),
    nonce: z
      .string()
      .describe(
        "The delegation nonce. This starts at 0 and must be positive. The EOA must keep track of this nonce itself"
      ),
    chainId: z
      .number()
      .int()
      .positive()
      .describe("The chainId ID where the authorization is valid"),
    signature: z
      .string()
      .regex(/^0x[a-fA-F0-9]+$/)
      .describe(
        "The signature of the authorization, from the EOA that is delegating the authorization to the contract at address"
      ),
  })
  .describe(
    "A single authorization for an ERC-7702 contractMethod. It represents a single potential delegation from an EOA to a contract"
  );

// Validation for executing a contractMethod
export const executeContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe("The ID of the contractMethod to execute. Identifies which contractMethod to run"),
    params: contractMethodParamsSchema,
    walletId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "The ID of the escrow wallet that will execute the contractMethod. If not provided, the default escrow wallet for the contractMethod will be used"
      ),
    memo: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Optional text supplied when the contractMethod is executed. This can be a note to the user about why the execution was done, or formatted information such as JSON that can be used by the user's system"
      ),
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the contractMethod. If you are using ERC-7702, you must provide at least one authorization"
      ),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe("The address of the smart contract. Can be overridden for this specific execution"),
    authorizationDataAddress: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The address of the ERC-7702 contract to upgrade the Wallet that executes this transaction to. This is basically the same as the authorization list, but allows you to upgrade the Wallet, instead of an external EOA. The signature and nonce params for the AuthorizationList entry are generated by the server. Providing this parameter also requires that you set the contractAddress to the address of the Wallet or it will cause an error."
      ),
  })
  .describe(
    "Parameters required to execute a contractMethod. Includes the function parameters, optional escrow wallet override, optional memo, optional value for payable methods, and optional contract address override"
  );

// Validation for executing a contractMethod as a delegator
export const executeAsDelegatorContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to execute as a delegator. Identifies which contractMethod to run"
      ),
    params: contractMethodParamsSchema,
    walletId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "The ID of the escrow wallet that will execute the contractMethod. If not provided, the default escrow wallet for the contractMethod will be used"
      ),
    memo: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Optional text supplied when the contractMethod is executed. This can be a note to the user about why the execution was done, or formatted information such as JSON that can be used by the user's system"
      ),
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the contractMethod. If you are using ERC-7702, you must provide at least one authorization"
      ),
    delegatorAddress: z
      .string()
      .describe("The address of the delegator on whose behalf the transaction will be executed"),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
  })
  .describe(
    "Parameters required to execute a contractMethod as a delegator. Similar to regular execution but executes the transaction on behalf of the specified delegator address"
  );

// Validation for batch contract method execution
export const batchContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe("The ID of the contractMethod to execute. Identifies which contractMethod to run"),
    executionIndex: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "The order in which to execute this method. Must start at 0 and increment by 1. Must be unique. Provided in case the array gets shuffled in transmission"
      ),
    params: contractMethodParamsSchema,
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe("The address of the smart contract. Can be overridden for this specific execution"),
  })
  .describe("A single contract method execution within a batch");

// Validation for batch contract method execution as delegator
export const batchContractMethodAsDelegatorSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe("The ID of the contractMethod to execute. Identifies which contractMethod to run"),
    executionIndex: z
      .number()
      .int()
      .nonnegative()
      .describe(
        "The order in which to execute this method. Must start at 0 and increment by 1. Must be unique. Provided in case the array gets shuffled in transmission"
      ),
    params: contractMethodParamsSchema,
    delegatorAddress: z
      .string()
      .describe("The address of the delegator on whose behalf the transaction will be executed"),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe("The address of the smart contract. Can be overridden for this specific execution"),
  })
  .describe("A single contract method execution within a batch as delegator");

// Validation for executing batch contract methods
export const executeBatchContractMethodSchema = z
  .object({
    contractMethods: z
      .array(batchContractMethodSchema)
      .describe("Array of contract methods to execute in batch"),
    walletId: z.string().uuid().describe("The ID of the escrow wallet that will execute the batch"),
    atomic: z
      .boolean()
      .optional()
      .describe(
        "If true, all transactions in the batch must succeed, or the entire batch is rolled back. If false, the executions that succeed will complete, but no transactions after the first failure will be executed"
      ),
    memo: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Optional text supplied when the batch is executed. This can be a note to the user about why the execution was done, or formatted information such as JSON that can be used by the user's system"
      ),
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the batch. If you are using ERC-7702, you must provide at least one authorization"
      ),
    gasLimit: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The gas limit for the transaction. The transaction will revert if it uses more gas than this, and you will spend the gas in the process. Ordinarily, you do not need this, 1Shot will calculate it for you. However, for some very complicated transactions, you may need to set the gas limit manually as the normal estimation process may underestimate the gas amount"
      ),
  })
  .describe("Parameters for executing multiple contract methods in a single batch transaction");

// Validation for executing batch contract methods as delegator
export const executeBatchAsDelegatorContractMethodSchema = z
  .object({
    contractMethods: z
      .array(batchContractMethodAsDelegatorSchema)
      .describe("Array of contract methods to execute in batch as delegator"),
    walletId: z.string().uuid().describe("The ID of the escrow wallet that will execute the batch"),
    atomic: z
      .boolean()
      .optional()
      .describe(
        "If true, all transactions in the batch must succeed, or the entire batch is rolled back. If false, the executions that succeed will complete, but no transactions after the first failure will be executed"
      ),
    memo: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Optional text supplied when the batch is executed. This can be a note to the user about why the execution was done, or formatted information such as JSON that can be used by the user's system"
      ),
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the batch. If you are using ERC-7702, you must provide at least one authorization"
      ),
    gasLimit: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The gas limit for the transaction. The transaction will revert if it uses more gas than this, and you will spend the gas in the process. Ordinarily, you do not need this, 1Shot will calculate it for you. However, for some very complicated transactions, you may need to set the gas limit manually as the normal estimation process may underestimate the gas amount"
      ),
  })
  .describe(
    "Parameters for executing multiple contract methods in a single batch transaction as delegator"
  );

// Validation for testing a contractMethod
export const testContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to test. Identifies which contractMethod to simulate"
      ),
    params: contractMethodParamsSchema,
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the contractMethod. If you are using ERC-7702, you must provide at least one authorization"
      ),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
    contractAddress: z
      .string()
      .optional()
      .nullable()
      .describe("The address of the smart contract. Can be overridden for this specific test"),
  })
  .describe(
    "Parameters for testing a contractMethod - simulates execution without spending gas or changing on-chainId state. Used for validating contractMethod parameters before actual execution"
  );

// Validation for getting a contractMethod
export const getContractMethodSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .describe("The ID of the contractMethod to get. Identifies which contractMethod to retrieve"),
  })
  .describe(
    "Parameters for getting a contractMethod. Used to retrieve a single contractMethod by its ID"
  );

// Validation for estimating a contractMethod
export const estimateContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to estimate. Identifies which contractMethod to analyze"
      ),
    params: contractMethodParamsSchema,
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the contractMethod. If you are using ERC-7702, you must provide at least one authorization"
      ),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
  })
  .describe(
    "Parameters for estimating a contractMethod - returns data about fees and gas amount. Used to calculate contractMethod costs before execution"
  );

// Validation for encoding a contractMethod
export const encodeContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to encode. Identifies which contractMethod to encode"
      ),
    params: contractMethodParamsSchema,
    authorizationList: z
      .array(erc7702AuthorizationSchema)
      .optional()
      .nullable()
      .describe(
        "A list of authorizations for the contractMethod. If you are using ERC-7702, you must provide at least one authorization"
      ),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "The amount of native token to send along with the contractMethod. This is only applicable for contractMethods that are payable. Including this value for a nonpayable method will result in an error"
      ),
  })
  .describe(
    "Parameters for encoding a contractMethod - returns hex string of encoded data. Used to call the contractMethod directly on the blockchain"
  );

// Validation for reading a contractMethod
export const readContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe("The ID of the contractMethod to read. Identifies which contractMethod to query"),
    params: contractMethodParamsSchema,
  })
  .describe(
    "Parameters for reading a contractMethod - gets result of view or pure function. Used for reading blockchain state without making changes"
  );

// Validation for creating a contractMethod
export const createContractMethodSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe(
        "The business ID to create the contractMethod for. Used for access control and organization"
      ),
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Determines which blockchain network the contractMethod will operate on"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that contains the function to be called"),
    walletId: z
      .string()
      .uuid()
      .describe(
        "The ID of the escrow wallet that will execute the contractMethod. This escrow wallet must be for the same chainId as the contractMethod you are creating"
      ),
    name: z
      .string()
      .describe(
        "Name of contractMethod, used for display purposes and lookup. Helps identify the contractMethod in lists and logs"
      ),
    description: z
      .string()
      .describe(
        "Description of contractMethod, including details about what it does and when it should be called. Useful for documentation and understanding contractMethod purpose"
      ),
    functionName: z
      .string()
      .describe(
        "The actual method name on the smart contract. Solidity names are case sensitive and must match precisely. Defines which function will be called"
      ),
    stateMutability: contractMethodStateMutabilitySchema,
    inputs: z
      .array(newSolidityStructParamSchema)
      .describe(
        "The input parameters for the contractMethod function. Defines the structure and types of parameters required for execution"
      ),
    outputs: z
      .array(newSolidityStructParamSchema)
      .describe(
        "The output parameters for the contractMethod function. Defines the structure and types of values returned after execution"
      ),
    callbackUrl: z
      .string()
      .url()
      .optional()
      .nullable()
      .describe(
        "The URL to send webhooks to when this contractMethod is executed. This must be a valid HTTP or HTTPS URL and include the protocol. Used for contractMethod status notifications"
      ),
  })
  .describe(
    "Parameters for creating a new ContractMethod. A ContractMethod is sometimes referred to as an Endpoint. A ContractMethod corresponds to a single method on a smart contract, and most of the required information to create one can be pulled from an Ethereum ABI. ContractMethods can be configured with static values for input parameters, which is useful for controlling how the contractMethod is called"
  );

// Validation for importing contractMethods from ABI
export const importFromABISchema = z
  .object({
    businessId: z.string().uuid().describe("The ID of the business that owns the contractMethod"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Determines which blockchain network the contractMethod will be executed on"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that contains the function to be called"),
    walletId: z
      .string()
      .uuid()
      .describe(
        "The ID of the escrow wallet that will execute the contractMethod. Must be for the same chainId as the contractMethod"
      ),
    abi: ethereumAbiSchema,
    name: z
      .string()
      .optional()
      .nullable()
      .describe("The name of the smart contract, if it doesn't already exist"),
    description: z
      .string()
      .optional()
      .nullable()
      .describe("A description of the smart contract, if it doesn't already exist"),
    tags: z.array(z.string()).optional().describe("Tags to add to the smart contract"),
  })
  .describe(
    "Parameters for importing contractMethods from an Ethereum ABI. Creates contractMethods for each function in the ABI"
  );

// Validation for updating a contractMethod
export const updateContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to update. Identifies which contractMethod to modify"
      ),
    params: contractMethodUpdateSchema,
  })
  .describe(
    "Parameters for updating a contractMethod. Used to modify existing contractMethod properties"
  );

// Validation for deleting a contractMethod
export const deleteContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to delete. Identifies which contractMethod to remove"
      ),
  })
  .describe(
    "Parameters for deleting a contractMethod. Used to remove a contractMethod from the system"
  );

// Validation for restoring a contractMethod
export const restoreContractMethodSchema = z
  .object({
    contractMethodId: z
      .string()
      .uuid()
      .describe(
        "The ID of the contractMethod to restore. Identifies which deleted contractMethod to recover"
      ),
  })
  .describe(
    "Parameters for restoring a contractMethod - undeletes contractMethod objects. Used to recover previously deleted contractMethods"
  );

// Validation for contract function parameter description
export const contractFunctionParamDescriptionSchema = z
  .object({
    index: z.number().int().nonnegative().describe("The index of the parameter. Starts at 0"),
    name: z
      .string()
      .describe(
        "The name of the parameter, as defined in the Solidity contract. Input parameters are required to have names; this may be blank for output parameters"
      ),
    description: z
      .string()
      .describe(
        "A description of the parameter and its purpose. These descriptions are provided by either humans or AI and are intended for AI agent consumption"
      ),
    tags: z
      .array(z.string())
      .describe("An array of tag names associated with the function parameter"),
  })
  .describe("A description of a function parameter. This may be an input or an output parameter");

// Validation for contract function description
export const contractFunctionPromptSchema = z
  .object({
    name: z
      .string()
      .describe(
        "The name of the function. This has to exactly match the name of the function in the Solidity contract, including the case and whitespace"
      ),
    description: z
      .string()
      .describe(
        "A human provided description of the function, what it does, and a basic overview of its parameters"
      ),
    tags: z.array(z.string()).describe("An array of tag names provided to the contract function"),
    inputs: z
      .array(contractFunctionParamDescriptionSchema)
      .describe(
        "An array of input parameters for the function. All inputs are required to be named"
      ),
    outputs: z
      .array(contractFunctionParamDescriptionSchema)
      .describe(
        "An array of input parameters for the function. All inputs are required to be named"
      ),
  })
  .describe("The description of a single function on a contract");

// Validation for contract description
export const promptSchema = z
  .object({
    id: z.string().uuid().describe("internal ID of the contract description"),
    userId: z.string().uuid().describe("ID of the user that created"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe("The ChainId of a supported chainId on 1Shot API"),
    contractAddress: z.string().describe("The address of the smart contract"),
    name: z
      .string()
      .describe(
        "The name of the contract. This is human provided and has no technical significance"
      ),
    description: z
      .string()
      .describe(
        "The human provided description of what the contract is and does, and the top level"
      ),
    tags: z.array(z.string()).describe("An array of tag names provided to the contract"),
    updated: z
      .number()
      .describe("Unix timestamp of when the contract description was last updated"),
    created: z.number().describe("Unix timestamp of when the contract description was created"),
  })
  .describe("A description of a contract, designed to be used for contract discovery by AI agents");

// Validation for full contract description
export const fullPromptSchema = promptSchema
  .extend({
    functions: z
      .array(contractFunctionPromptSchema)
      .describe(
        "An array of Contract Function Descriptions, describing each function on the contract"
      ),
  })
  .describe("A description of a smart contract, including all functions and parameters");

// Validation for contract search request
export const contractSearchSchema = z
  .object({
    query: z
      .string()
      .describe(
        "A free-form query to search for contracts. This uses semantic search to find the most relevant contracts."
      ),
    chainId: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("The ChainId of a supported chainId on 1Shot API"),
  })
  .describe("Parameters for searching contract descriptions");

// Validation for contract contractMethods request
export const contractContractMethodsSchema = z
  .object({
    businessId: z
      .string()
      .uuid()
      .describe(
        "The business ID to create the contractMethods for. Used for access control and organization"
      ),
    chainId: z
      .number()
      .int()
      .positive()
      .describe(
        "The ChainId of a supported chainId on 1Shot API. Determines which blockchain network the contractMethods will operate on"
      ),
    contractAddress: z
      .string()
      .describe("The address of the smart contract that contains the functions to be imported"),
    walletId: z
      .string()
      .uuid()
      .describe(
        "The ID of the escrow wallet that will execute the contractMethods. Must be for the same chainId as the contractMethods"
      ),
    promptId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe(
        "The ID of the contract description that you want to use. If not provided, the highest-ranked Contract Description for the chainId and contract address will be used. This is optional, and a ContractMethod can drift from the original Contract Description but retain this association"
      ),
  })
  .describe(
    "Parameters for creating contractMethods from a contract description. This is based on the verified contract ABI and the highest-ranked Contract Description."
  );

// Validation for contractMethod test result
export const contractMethodTestResultSchema = z
  .object({
    success: z.boolean().describe("Whether or not the contractMethod would run successfully"),
    result: z
      .record(z.any())
      .nullable()
      .describe(
        "The result returned by the contractMethod, if it was successful. When running a test, no changes are made on the blockchain, so these results are hypothetical"
      ),
    error: z
      .record(z.any())
      .nullable()
      .describe("The error that occurred, if the contractMethod was not successful"),
  })
  .describe("The result of running /test on a contractMethod");

// Validation for contractMethod encode result
export const contractMethodEncodeResultSchema = z
  .object({
    data: z
      .string()
      .regex(/^0x[a-fA-F0-9]+$/)
      .describe("The hex string of the encoded data"),
  })
  .describe("The result of running /encode on a contractMethod");

// Validation for assure contract methods from prompt parameters
export const assureContractMethodsFromPromptSchema = z
  .object({
    businessId: z.string().uuid().describe("ID of the business to create contract methods for"),
    chainId: z
      .number()
      .int()
      .positive()
      .describe("ID of the blockchain network where the contract exists"),
    contractAddress: z.string().describe("Address of the smart contract"),
    walletId: z.string().uuid().describe("ID of the wallet that will execute the contract methods"),
    promptId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe("ID of the prompt to use. If not provided, the highest-ranked Prompt will be used"),
  })
  .describe("Parameters for assuring contract methods exist for a given Prompt");
