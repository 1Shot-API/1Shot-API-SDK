import { z } from "zod";

import {
  chainInfoSchema,
  chainListSchema,
  listChainsSchema,
  nativeCurrencyInformationSchema,
  gasFeesSchema,
  getFeesSchema,
  contractCodeInfoSchema,
  getCodeSchema,
} from "../validation/chain.js";

/**
 * Represents information about a chain supported by 1Shot API.
 */
export type ChainInfo = z.infer<typeof chainInfoSchema>;

/**
 * Represents information about the native currency of a chain.
 */
export type NativeCurrencyInformation = z.infer<typeof nativeCurrencyInformationSchema>;

/**
 * Represents current gas fees for a blockchain.
 */
export type GasFees = z.infer<typeof gasFeesSchema>;

/**
 * Represents a paginated list of chains.
 */
export type ChainList = z.infer<typeof chainListSchema>;

/**
 * Parameters for listing chains.
 */
export type ListChains = z.infer<typeof listChainsSchema>;

/**
 * Parameters for getting gas fees for a specific chain.
 */
export type GetFees = z.infer<typeof getFeesSchema>;

/**
 * Result of inspecting bytecode at an address (eth_getCode and EIP-7702 delegation info).
 */
export type ContractCodeInfo = z.infer<typeof contractCodeInfoSchema>;

/**
 * Parameters for inspecting bytecode at an address on a chain.
 */
export type GetCode = z.infer<typeof getCodeSchema>;
