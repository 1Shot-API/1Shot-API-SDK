import { z } from "zod";

import {
  contractFunctionPromptSchema,
  promptSchema,
  fullPromptSchema,
} from "../validation/contractMethod.js";

export type ContractFunctionPrompt = z.infer<typeof contractFunctionPromptSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type FullPrompt = z.infer<typeof fullPromptSchema>;
