import { z } from "zod";

/**
 * Schema for validating function parameters, event parameters, and struct fields
 * Uses z.lazy() to handle the circular dependency in the components property
 */
export const abiParameterSchema: z.ZodType<{
  name?: string;
  type: string;
  internalType?: string;
  components?: Array<z.infer<typeof abiParameterSchema>>;
  indexed?: boolean;
}> = z.object({
  /** Name of the parameter (optional for some ABI types) */
  name: z.string().optional(),
  /** Solidity type of the parameter */
  type: z.string(),
  /** Internal type of the parameter (used for complex types) */
  internalType: z.string().optional(),
  /** Array of components for tuple types */
  components: z.lazy(() => z.array(abiParameterSchema)).optional(),
  /** Whether the parameter is indexed (for event parameters) */
  indexed: z.boolean().optional(),
});

/**
 * Schema for validating the structure of a smart contract function
 */
export const abiFunctionSchema = z.object({
  /** Type identifier (always 'function') */
  type: z.literal("function"),
  /** Name of the function */
  name: z.string(),
  /** State mutability of the function */
  stateMutability: z.enum(["pure", "view", "nonpayable", "payable"]),
  /** Array of input parameters */
  inputs: z.array(abiParameterSchema),
  /** Array of output parameters */
  outputs: z.array(abiParameterSchema),
});

/**
 * Schema for validating the structure of a smart contract event
 */
export const abiEventSchema = z.object({
  /** Type identifier (always 'event') */
  type: z.literal("event"),
  /** Name of the event */
  name: z.string(),
  /** Array of event parameters */
  inputs: z.array(abiParameterSchema),
  /** Whether the event is anonymous */
  anonymous: z.boolean().optional(),
});

/**
 * Schema for validating the structure of a smart contract constructor
 */
export const abiConstructorSchema = z.object({
  /** Type identifier (always 'constructor') */
  type: z.literal("constructor"),
  /** Array of constructor parameters */
  inputs: z.array(abiParameterSchema),
  /** State mutability of the constructor */
  stateMutability: z.enum(["nonpayable", "payable"]),
});

/**
 * Schema for validating the structure of a smart contract fallback function
 */
export const abiFallbackSchema = z.object({
  /** Type identifier (always 'fallback') */
  type: z.literal("fallback"),
  /** State mutability of the fallback function */
  stateMutability: z.enum(["nonpayable", "payable"]),
});

/**
 * Schema for validating an error
 */
export const abiErrorSchema = z.object({
  /** Type identifier (always 'error') */
  type: z.literal("error"),
  /** Name of the error */
  name: z.string(),
  /** Array of error parameters */
  inputs: z.array(abiParameterSchema),
});

/**
 * Schema for validating the structure of a smart contract receive function
 * This is a special function that is used to receive native tokens
 */
export const abiReceiveSchema = z.object({
  /** Type identifier (always 'receive') */
  type: z.literal("receive"),
  /** State mutability of the receive function */
  stateMutability: z.literal("payable"),
});

/**
 * Schema for validating an Ethereum ABI
 * Uses a discriminated union based on the 'type' property to validate different ABI entries
 */
export const ethereumAbiSchema = z.array(
  z.discriminatedUnion("type", [
    abiFunctionSchema,
    abiEventSchema,
    abiConstructorSchema,
    abiFallbackSchema,
    abiErrorSchema,
    abiReceiveSchema,
  ])
);
