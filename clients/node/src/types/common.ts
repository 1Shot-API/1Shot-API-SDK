import { pagedResponseSchema } from "../validation/common.js";
import { z } from "zod";

/**
 * Represents a paged response from the API.
 * This type is used for endpoints that return paginated results.
 * @template T The type of items in the response array
 */
export type PagedResponse<T> = z.infer<ReturnType<typeof pagedResponseSchema<T>>>;
