import { z } from "zod";

// Validation for one historical block fee item (eth_feeHistory normalized)
export const blockHistorySchema = z
  .object({
    blockNumber: z.number().int().describe("Block number"),
    baseFeePerGas: z.string().describe("Base fee per gas in wei for this block"),
    gasUsedRatio: z.number().describe("Ratio of gas used to block gas limit"),
    baseFeePerBlob: z.string().describe("Blob base fee in wei for this block (0 when unavailable)"),
    blobGasUsedRatio: z
      .number()
      .describe("Ratio of blob gas used for this block (0 when unavailable)"),
    reward20: z.string().describe("Effective priority fee reward at the 20th percentile"),
    reward50: z.string().describe("Effective priority fee reward at the 50th percentile"),
    reward100: z.string().describe("Effective priority fee reward at the 100th percentile"),
  })
  .describe("Fee and usage data for one historical block");

// Validation for fee history bundle
export const gasFeesHistorySchema = z
  .object({
    nextBaseFeePerGas: z.string().describe("Projected base fee per gas for the next block"),
    blocks: z.array(blockHistorySchema).describe("Recent fee history blocks"),
  })
  .describe("Normalized eth_feeHistory data for recent blocks");

// How the chain prices gas (matches GasFeePricingModel in the API spec)
export const gasFeePricingModelSchema = z
  .enum(["legacy", "erc1559"])
  .describe("How the chain prices gas — legacy fixed gas price, or EIP-1559 base + priority");

// Validation for gas fees
export const gasFeesSchema = z
  .object({
    effectiveGasPrice: z
      .string()
      .describe(
        "Effective gas price in wei — for legacy chains, the gas price; for EIP-1559, next base fee plus max priority fee"
      ),
    pricingModel: gasFeePricingModelSchema,
    gasPrice: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Gas price in wei for non-EIP-1559 chains (e.g., Binance). Will be null for EIP-1559 chains"
      ),
    maxFeePerGas: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Maximum fee per gas in wei for EIP-1559 chains. Will be null for non-EIP-1559 chains"
      ),
    maxPriorityFeePerGas: z
      .string()
      .optional()
      .nullable()
      .describe(
        "Maximum priority fee per gas in wei for EIP-1559 chains. Will be null for non-EIP-1559 chains"
      ),
    nextBaseFeePerGas: z
      .string()
      .optional()
      .nullable()
      .describe("Projected base fee per gas for the next block"),
    history: gasFeesHistorySchema
      .optional()
      .nullable()
      .describe("Normalized fee history for recent blocks"),
  })
  .describe("Current gas fees for a blockchain with optional EIP-1559 fee history");

// Validation for native currency information
export const nativeCurrencyInformationSchema = z
  .object({
    name: z.string().describe("The name of the currency"),
    symbol: z.string().describe("The symbol of the currency"),
    decimals: z.number().describe("The number of decimals of the currency"),
  })
  .describe("Information about the native currency of a chain");

// Validation for chain info
export const chainInfoSchema = z
  .object({
    name: z.string().describe("The name of the chain"),
    chainId: z.number().int().positive().describe("The ChainId of a supported chain on 1Shot API"),
    averageBlockMiningTime: z
      .number()
      .describe("The average time it takes to mine a block on the chain"),
    nativeCurrency: nativeCurrencyInformationSchema.describe(
      "Information about the native currency of the chain"
    ),
    type: z.enum(["Mainnet", "Testnet", "Hardhat"]).describe("The type of the chain"),
  })
  .describe("Information about a chain supported by 1Shot API");

// Validation for chain list response
export const chainListSchema = z
  .object({
    response: z.array(chainInfoSchema).describe("List of chains"),
    page: z.number().int().positive().describe("Current page number in the paginated results"),
    pageSize: z.number().int().positive().describe("Number of items per page"),
    totalResults: z
      .number()
      .int()
      .nonnegative()
      .describe("Total number of results across all pages"),
  })
  .describe("Paginated list of chains");

// Validation for list chains parameters
export const listChainsSchema = z
  .object({
    pageSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Number of items per page"),
    page: z.number().int().positive().optional().nullable().describe("Page number to retrieve"),
  })
  .describe("Parameters for listing chains");

// Validation for get fees parameters
export const getFeesSchema = z
  .object({
    chainId: z.number().int().positive().describe("The ChainId of a supported chain on 1Shot API"),
    numberOfBlocks: z
      .number()
      .int()
      .min(1)
      .max(1024)
      .optional()
      .describe("Number of latest blocks to request from eth_feeHistory"),
  })
  .describe("Parameters for getting gas fees for a specific chain");

// Result of GET /chains/{chainId}/contracts/{contractAddress} (eth_getCode + EIP-7702 delegation)
export const contractCodeInfoSchema = z
  .object({
    isContract: z
      .boolean()
      .describe("True if eth_getCode returned non-empty bytecode at this address"),
    eip7702ImplementationAddress: z
      .string()
      .nullable()
      .describe(
        "When bytecode is exactly the EIP-7702 delegation designator plus a 20-byte implementation address, that implementation contract; otherwise null"
      ),
  })
  .describe("Bytecode summary at an address, including EIP-7702 delegation when applicable");

// Validation for getCode parameters
export const getCodeSchema = z
  .object({
    chainId: z.number().int().positive().describe("Chain ID to query"),
    contractAddress: z.string().describe("Contract or account address to inspect"),
  })
  .describe("Parameters for inspecting bytecode at an address on a chain");
