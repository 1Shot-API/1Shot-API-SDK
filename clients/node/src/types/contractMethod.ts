import { z } from "zod";
import {
  contractMethodStateMutabilitySchema,
  contractMethodStatusSchema,
  contractMethodParamsSchema,
  contractMethodEstimateSchema,
  contractMethodUpdateSchema,
  contractMethodSchema,
  contractMethodListSchema,
  listContractMethodsSchema,
  executeContractMethodSchema,
  executeAsDelegatorContractMethodSchema,
  batchContractMethodSchema,
  batchContractMethodAsDelegatorSchema,
  executeBatchContractMethodSchema,
  executeBatchAsDelegatorContractMethodSchema,
  testContractMethodSchema,
  getContractMethodSchema,
  estimateContractMethodSchema,
  readContractMethodSchema,
  createContractMethodSchema,
  importFromABISchema,
  updateContractMethodSchema,
  deleteContractMethodSchema,
  restoreContractMethodSchema,
  contractFunctionParamDescriptionSchema,
  contractSearchSchema,
  contractContractMethodsSchema,
  contractMethodTestResultSchema,
  contractMethodEncodeResultSchema,
  erc7702AuthorizationSchema,
} from "../validation/contractMethod.js";

export type ContractMethodStateMutability = z.infer<typeof contractMethodStateMutabilitySchema>;
export type ContractMethodStatus = z.infer<typeof contractMethodStatusSchema>;
export type ContractMethodParams = z.infer<typeof contractMethodParamsSchema>;
export type ContractMethodEstimate = z.infer<typeof contractMethodEstimateSchema>;
export type ContractMethodUpdate = z.infer<typeof contractMethodUpdateSchema>;
export type ContractMethod = z.infer<typeof contractMethodSchema>;
export type ContractMethodList = z.infer<typeof contractMethodListSchema>;
export type ListContractMethods = z.infer<typeof listContractMethodsSchema>;
export type ExecuteContractMethod = z.infer<typeof executeContractMethodSchema>;
export type ExecuteAsDelegatorContractMethod = z.infer<
  typeof executeAsDelegatorContractMethodSchema
>;
export type BatchContractMethod = z.infer<typeof batchContractMethodSchema>;
export type BatchContractMethodAsDelegator = z.infer<typeof batchContractMethodAsDelegatorSchema>;
export type ExecuteBatchContractMethod = z.infer<typeof executeBatchContractMethodSchema>;
export type ExecuteBatchAsDelegatorContractMethod = z.infer<
  typeof executeBatchAsDelegatorContractMethodSchema
>;
export type TestContractMethod = z.infer<typeof testContractMethodSchema>;
export type GetContractMethod = z.infer<typeof getContractMethodSchema>;
export type EstimateContractMethod = z.infer<typeof estimateContractMethodSchema>;
export type ReadContractMethod = z.infer<typeof readContractMethodSchema>;
export type CreateContractMethod = z.infer<typeof createContractMethodSchema>;
export type ImportFromABI = z.infer<typeof importFromABISchema>;
export type UpdateContractMethod = z.infer<typeof updateContractMethodSchema>;
export type DeleteContractMethod = z.infer<typeof deleteContractMethodSchema>;
export type RestoreContractMethod = z.infer<typeof restoreContractMethodSchema>;
export type ContractFunctionParamDescription = z.infer<
  typeof contractFunctionParamDescriptionSchema
>;
export type ContractSearch = z.infer<typeof contractSearchSchema>;
export type ContractContractMethods = z.infer<typeof contractContractMethodsSchema>;
export type ContractMethodTestResult = z.infer<typeof contractMethodTestResultSchema>;
export type ContractMethodEncodeResult = z.infer<typeof contractMethodEncodeResultSchema>;
export type ERC7702Authorization = z.infer<typeof erc7702AuthorizationSchema>;
