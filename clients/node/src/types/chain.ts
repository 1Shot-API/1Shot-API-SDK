import { z } from "zod";

import {
  chainInfoSchema,
  chainListSchema,
  listChainsSchema,
  nativeCurrencyInformationSchema,
  gasFeesSchema,
  getFeesSchema,
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
