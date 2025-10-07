import { z } from "zod";

import {
  abiParameterSchema,
  abiFunctionSchema,
  abiEventSchema,
  abiConstructorSchema,
  abiFallbackSchema,
  ethereumAbiSchema,
} from "../validation/abi.js";

/**
 * Represents a parameter in an Ethereum ABI.
 * This type is used to define function parameters, event parameters, and struct fields.
 */
export type AbiParameter = z.infer<typeof abiParameterSchema>;

/**
 * Represents a function in an Ethereum ABI.
 * This type defines the structure of a smart contract function.
 */
export type AbiFunction = z.infer<typeof abiFunctionSchema>;

/**
 * Represents an event in an Ethereum ABI.
 * This type defines the structure of a smart contract event.
 */
export type AbiEvent = z.infer<typeof abiEventSchema>;

/**
 * Represents a constructor in an Ethereum ABI.
 * This type defines the structure of a smart contract constructor.
 */
export type AbiConstructor = z.infer<typeof abiConstructorSchema>;

/**
 * Represents a fallback function in an Ethereum ABI.
 * This type defines the structure of a smart contract fallback function.
 */
export type AbiFallback = z.infer<typeof abiFallbackSchema>;

/**
 * Represents a complete Ethereum ABI.
 * This type is an array of function, event, constructor, and fallback definitions.
 */
export type EthereumAbi = z.infer<typeof ethereumAbiSchema>;
