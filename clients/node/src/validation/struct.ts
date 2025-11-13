import { z } from "zod";

// Validation for Solidity types
export const solidityTypeSchema = z
  .enum(["address", "bool", "bytes", "int", "string", "uint", "struct"])
  .describe("The type of a Solidity parameter");

// Base schema for Solidity struct parameters
const baseSolidityStructParamSchema = z.object({
  name: z.string().describe("The name of the parameter"),
  description: z.string().optional().nullable().describe("Description of the parameter"),
  type: solidityTypeSchema,
  index: z
    .number()
    .int()
    .min(0)
    .describe(
      "This is the relative index in the contract function. It should start at 0, and must not skip any numbers."
    ),
  value: z
    .string()
    .optional()
    .nullable()
    .describe(
      "This is an optional, static value for the parameter. If you set this, you will never be required or able to pass a value for this parameter when you execute the transaction, it will use the set value."
    ),
  typeSize: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .describe(
      "This is an optional field that specifies the main size of the Solidity type. For example, if your type is uint, by default it is a uint256. If you want a uint8 instead, set this value to 8. It works for int, uint, fixed, ufixed, and bytes types. Valid values for bytes are 1 to 32, for others it is 256 % 8"
    ),
  typeSize2: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .describe(
      "This is identical to typeSize but only used for fixed and ufixed sizes. This is the second size of the fixed field, for example, fixed(typeSize)x(typeSize2)."
    ),
  isArray: z
    .boolean()
    .default(false)
    .optional()
    .nullable()
    .describe(
      "If this parameter is an array type set this to true. By default, arrays can be of any size so you don't need to set arraySize."
    ),
  arraySize: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .describe("If the parameter is a fixed size array, set this value."),
  typeStructId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .describe(
      'The ID of the sub-struct if the type is "struct". When creating a param, you must set only one of either typeStructId (to re-use an existing Solidity Struct) or typeStruct (creates a new struct for the param)'
    ),
});

// Schema for new Solidity structs (requires name)
export const newSolidityStructSchema: z.ZodType = z.object({
  name: z.string().min(1).describe("The name of the struct"),
  params: z
    .array(z.lazy(() => newSolidityStructParamSchema))
    .describe("The parameters that make up the struct"),
});

// Schema for existing Solidity structs (name is optional)
export const solidityStructSchema: z.ZodType = z.object({
  id: z.string().uuid().describe("Internal ID of the struct"),
  businessId: z.string().uuid().describe("Internal ID of the business that owns this struct"),
  params: z
    .array(z.lazy(() => solidityStructParamSchema))
    .describe("The parameters that make up the struct"),
  updated: z.number().describe("Unix timestamp of when the struct was last updated"),
  created: z.number().describe("Unix timestamp of when the struct was created"),
});

// Validation for creating a new Solidity struct parameter
export const newSolidityStructParamSchema = baseSolidityStructParamSchema
  .extend({
    typeStruct: newSolidityStructSchema
      .optional()
      .nullable()
      .describe(
        'The sub-struct if the type is "struct", which will be created for use by this parameter. When creating a param, you must set only one of either typeStructId (to re-use an existing Solidity Struct) or typeStruct (creates a new struct for the param)'
      ),
  })
  .refine(
    (data): boolean => {
      // Validate that typeSize is only set for numeric types
      if (data.typeSize !== undefined) {
        return ["int", "uint", "bytes"].includes(data.type);
      }
      return true;
    },
    {
      message: "typeSize can only be set for int, uint, or bytes types",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that typeSize2 is only set for fixed types
      if (data.typeSize2 != undefined) {
        return ["fixed", "ufixed"].includes(data.type);
      }
      return true;
    },
    {
      message: "typeSize2 can only be set for fixed or ufixed types",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that arraySize is only set when isArray is true
      if (data.arraySize != undefined) {
        return data.isArray === true;
      }
      return true;
    },
    {
      message: "arraySize can only be set when isArray is true",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that either typeStructId or typeStruct is set for struct type
      if (data.type === "struct") {
        return !!(data.typeStructId || data.typeStruct);
      }
      return true;
    },
    {
      message: "Either typeStructId or typeStruct must be set for struct type",
    }
  )
  .describe("A new Solidity struct parameter that can be created");

// Validation for Solidity struct parameter
export const solidityStructParamSchema = baseSolidityStructParamSchema
  .extend({
    id: z.string().uuid().describe("Internal ID of the parameter"),
    structId: z.string().uuid().describe("Internal ID struct that owns this parameter"),
    typeStruct: solidityStructSchema
      .optional()
      .nullable()
      .describe(
        'The sub-struct if the type is "struct", which will be created for use by this parameter. When creating a param, you must set only one of either typeStructId (to re-use an existing Solidity Struct) or typeStruct (creates a new struct for the param)'
      ),
  })
  .refine(
    (data): boolean => {
      // Validate that typeSize is only set for numeric types
      if (data.typeSize != undefined) {
        return ["int", "uint", "bytes"].includes(data.type);
      }
      return true;
    },
    {
      message: "typeSize can only be set for int, uint, or bytes types",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that typeSize2 is only set for fixed types
      if (data.typeSize2 != undefined) {
        return ["fixed", "ufixed"].includes(data.type);
      }
      return true;
    },
    {
      message: "typeSize2 can only be set for fixed or ufixed types",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that arraySize is only set when isArray is true
      if (data.arraySize != undefined) {
        return data.isArray === true;
      }
      return true;
    },
    {
      message: "arraySize can only be set when isArray is true",
    }
  )
  .refine(
    (data): boolean => {
      // Validate that either typeStructId or typeStruct is set for struct type
      if (data.type === "struct") {
        return !!(data.typeStructId || data.typeStruct);
      }
      return true;
    },
    {
      message: "Either typeStructId or typeStruct must be set for struct type",
    }
  )
  .describe("A Solidity struct parameter");

// Validation for updating a struct
export const structUpdateSchema = z
  .object({
    name: z.string().describe("The new name for the struct"),
  })
  .describe("Parameters for updating a struct");

// Validation for updating a struct parameter
export const solidityStructParamUpdateSchema: z.ZodType = z
  .object({
    name: z.string().optional().nullable().describe("The name of the parameter"),
    description: z.string().optional().nullable().describe("Optional description of the parameter"),
    type: z
      .enum(["address", "bool", "bytes", "int", "string", "uint", "struct"])
      .optional()
      .nullable()
      .describe("The Solidity type of the parameter"),
    index: z
      .number()
      .int()
      .min(0)
      .optional()
      .nullable()
      .describe(
        "This is the relative index in the contract function. It should start at 0, and must not skip any numbers."
      ),
    value: z
      .string()
      .optional()
      .nullable()
      .describe(
        "This is an optional, static value for the parameter. If you set this, you will never be required or able to pass a value for this parameter when you execute the transaction, it will use the set value."
      ),
    typeSize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe(
        "Optional size for the Solidity type (e.g., uint8, bytes32). Valid values: 1-32 for bytes, 8-256 for others"
      ),
    typeSize2: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Optional second size for fixed/ufixed types (e.g., fixed8x18)"),
    isArray: z.boolean().optional().nullable().describe("Whether this parameter is an array type"),
    arraySize: z
      .number()
      .int()
      .positive()
      .optional()
      .nullable()
      .describe("Fixed size of the array, if applicable"),
    typeStructId: z
      .string()
      .uuid()
      .optional()
      .nullable()
      .describe('ID of an existing struct to use as the type, if type is "struct"'),
    typeStruct: z
      .object({
        name: z.string().describe("Name of the new struct to create"),
        params: z
          .array(z.lazy(() => solidityStructParamUpdateSchema))
          .describe("Parameters for the new struct"),
      })
      .optional()
      .nullable()
      .describe(
        'The sub-struct if the type is "struct", which will be created for use by this parameter. When creating a param, you must set only one of either typeStructId (to re-use an existing Solidity Struct) or typeStruct (creates a new struct for the param)'
      ),
  })
  .refine(
    (data) => {
      // Validate that typeSize is only set for numeric types
      if (data.typeSize != undefined) {
        return ["int", "uint", "bytes"].includes(data.type || "");
      }
      return true;
    },
    {
      message: "typeSize can only be set for int, uint, or bytes types",
    }
  )
  .refine(
    (data) => {
      // Validate that typeSize2 is only set for fixed types
      if (data.typeSize2 != undefined) {
        return ["fixed", "ufixed"].includes(data.type || "");
      }
      return true;
    },
    {
      message: "typeSize2 can only be set for fixed or ufixed types",
    }
  )
  .refine(
    (data) => {
      // Validate that arraySize is only set when isArray is true
      if (data.arraySize != undefined) {
        return data.isArray === true;
      }
      return true;
    },
    {
      message: "arraySize can only be set when isArray is true",
    }
  )
  .refine(
    (data) => {
      // Validate that either typeStructId or typeStruct is set for struct type
      if (data.type === "struct") {
        return !!(data.typeStructId || data.typeStruct);
      }
      return true;
    },
    {
      message: "Either typeStructId or typeStruct must be set for struct type",
    }
  )
  .describe("Properties that may be updated on a Solidity Struct Param");

// Validation for adding a parameter to a struct
export const addStructParamSchema = z
  .object({
    businessId: z.string().uuid().describe("ID of the business that owns the struct"),
    structId: z.string().uuid().describe("ID of the struct to add the parameter to"),
    param: newSolidityStructParamSchema,
  })
  .describe("Parameters for adding a parameter to a struct");

// Validation for updating multiple struct parameters
export const updateStructParamsSchema = z
  .object({
    businessId: z.string().uuid().describe("ID of the business that owns the struct"),
    structId: z.string().uuid().describe("ID of the struct to update"),
    updates: z.array(solidityStructParamUpdateSchema).describe("Array of parameter updates"),
  })
  .describe("Parameters for updating multiple struct parameters");

// Validation for removing a struct parameter
export const removeStructParamSchema = z
  .object({
    structId: z.string().uuid().describe("ID of the struct"),
    structParamId: z.string().uuid().describe("ID of the parameter to remove"),
  })
  .describe("Parameters for removing a parameter from a struct");
