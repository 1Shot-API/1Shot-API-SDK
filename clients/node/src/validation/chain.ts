import { z } from "zod";

// Validation for gas fees
export const gasFeesSchema = z
  .object({
    gasPrice: z
      .string()
      .nullable()
      .describe(
        "Gas price in wei for non-EIP-1559 chains (e.g., Binance). Will be null for EIP-1559 chains"
      ),
    maxFeePerGas: z
      .string()
      .nullable()
      .describe(
        "Maximum fee per gas in wei for EIP-1559 chains. Will be null for non-EIP-1559 chains"
      ),
    maxPriorityFeePerGas: z
      .string()
      .nullable()
      .describe(
        "Maximum priority fee per gas in wei for EIP-1559 chains. Will be null for non-EIP-1559 chains"
      ),
  })
  .describe(
    "Current gas fees for a blockchain. Contains either gasPrice for non-EIP-1559 chains or maxFeePerGas and maxPriorityFeePerGas for EIP-1559 enabled chains"
  );

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
  })
  .describe("Parameters for getting gas fees for a specific chain");
