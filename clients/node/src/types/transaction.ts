import { transactionSchema, logDescriptionSchema } from "../validation/transaction.js";
import { z } from "zod";

/**
 * Represents the execution of a transaction in the 1Shot API.
 * This type tracks the status and details of a transaction.
 */
export type Transaction = z.infer<typeof transactionSchema>;

/**
 * Represents a log event emitted by a transaction.
 * This type describes the details of a blockchain log event.
 */
export type LogDescription = z.infer<typeof logDescriptionSchema>;
