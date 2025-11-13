import { z } from "zod";

export const pagedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    response: z.array(itemSchema),
    page: z
      .number()
      .int()
      .min(1)
      .describe("Which page to return. This is 1 indexed, and defaults to the first page, 1"),
    pageSize: z.number().int().min(1).describe("The size of the page to return. Defaults to 25"),
    totalResults: z
      .number()
      .int()
      .min(0)
      .describe("The total number of results returned by a paged response"),
  });
