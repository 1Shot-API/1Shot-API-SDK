import { z } from "zod";
import {
  newSolidityStructParamSchema,
  solidityStructParamSchema,
  solidityStructSchema,
  structUpdateSchema,
  solidityStructParamUpdateSchema,
  updateStructParamsSchema,
} from "../validation/struct.js";

export type SolidityStructParamUpdate = z.infer<typeof solidityStructParamUpdateSchema>;
export type NewSolidityStructParam = z.infer<typeof newSolidityStructParamSchema>;
export type SolidityStructParam = z.infer<typeof solidityStructParamSchema>;
export type SolidityStruct = z.infer<typeof solidityStructSchema>;
export type StructUpdate = z.infer<typeof structUpdateSchema>;
export type SolidityStructParamUpdateRequest = z.infer<typeof updateStructParamsSchema>;
