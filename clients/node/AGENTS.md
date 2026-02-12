This is the Node JS version of the client SDK for 1Shot API.

# General Instructions
Do not bother trying to fix linting errors yourself, just use `npm run format` and leave it alone. 

# Architecture

The client SDK is based on m2mGatewaySpec.yaml, an OpenAPI/swagger spec at the root of this repository. The SDK should contain all the methods in the m2m (machine to machine) API for 1Shot API.

For all versions of the client, methods are split into 5 categories: Contract Methods, Wallets, Transactions, Structs, and Chains. For this Node JS version, we have 3 main layers in the `/clients/node/src` directory: validation, types, and categories. The validation layer contains Zod schemas based on the m2mGatewaySpec, with both the requests and the responses specified in files matching the categories. This is where you should start when adding or updating things from the m2mGatewaySpec.

The next layer is types, which is where we create TypeScript types based on the Zod schemas.

The top layer is categories, which is where we actually define the methods in the SDK, using the types from types. Everything in categories is exposed in `/clients/node/src/client.ts`, which is the main class for the SDK. The OneShotClient class manages authentication, using the OAuth client credentials flow to get a bearer token used by the methods in categories, as well as updating it as needed.

## Adding New Categories and Methods

When adding a new category or method to the Node client, follow this step-by-step process:

### 1. Create Validation Schemas (`/validation/[category].ts`)

Start by creating Zod validation schemas for all the data structures defined in the m2mGatewaySpec:

- **Request schemas**: For API parameters and request bodies
- **Response schemas**: For API responses, including paginated responses
- **Entity schemas**: For core data objects (e.g., `chainInfoSchema`, `nativeCurrencyInformationSchema`)

Example structure:
```typescript
import { z } from 'zod';

// Entity schemas
export const entitySchema = z.object({
  // Define entity properties based on m2mGatewaySpec
}).describe('Description from spec');

// Request schemas
export const listEntitySchema = z.object({
  // Define request parameters
}).describe('Parameters for listing entities');

// Response schemas
export const entityListSchema = z.object({
  response: z.array(entitySchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalResults: z.number().int().nonnegative(),
}).describe('Paginated list of entities');
```

### 2. Create TypeScript Types (`/types/[category].ts`)

Create TypeScript types derived from the validation schemas:

```typescript
import { z } from 'zod';
import { entitySchema, entityListSchema, listEntitySchema } from '../validation/[category].js';

export type Entity = z.infer<typeof entitySchema>;
export type EntityList = z.infer<typeof entityListSchema>;
export type ListEntity = z.infer<typeof listEntitySchema>;
```

### 3. Create Category Class (`/categories/[category].ts`)

Implement the category class with methods that:

- Validate input parameters using the schemas
- Make HTTP requests to the API
- Validate responses using the schemas
- Return properly typed results

Example structure:
```typescript
import { IOneShotClient } from '../types/client.js';
import { Entity } from '../types/[category].js';
import { PagedResponse } from '../types/common.js';
import { entityListSchema, listEntitySchema } from '../validation/[category].js';

export class CategoryName {
  constructor(private client: IOneShotClient) {}

  async list(params?: { pageSize?: number; page?: number }): Promise<PagedResponse<Entity>> {
    // Validate parameters
    const validatedParams = listEntitySchema.parse(params || {});

    // Build query string
    const queryParams = new URLSearchParams();
    if (validatedParams.pageSize !== undefined) {
      queryParams.append('pageSize', validatedParams.pageSize.toString());
    }
    // ... add other parameters

    const queryString = queryParams.toString();
    const path = queryString ? `/endpoint?${queryString}` : '/endpoint';

    // Make request
    const response = await this.client.request<PagedResponse<Entity>>('GET', path);

    // Validate and return response
    return entityListSchema.parse(response);
  }
}
```

### 4. Update Main Client (`/client.ts`)

Add the new category to the main client:

```typescript
// Add import
import { CategoryName } from './categories/[category].js';

export class OneShotClient implements IOneShotClient {
  // Add public property
  public readonly categoryName: CategoryName;

  constructor(config: ClientConfig) {
    // ... existing initialization
    this.categoryName = new CategoryName(this);
  }
}
```

### 5. Update Exports (`/index.ts`)

Add exports for the new types and validation schemas:

```typescript
// Type exports
export * from './types/[category].js';

// Validation exports
export * from './validation/[category].js';
```

### 6. Testing

After implementation:
1. Run `npm run build` to ensure TypeScript compilation succeeds
2. Run `npm test` to verify existing tests still pass
3. Consider adding unit tests for the new functionality

### Key Principles

- **Start with validation**: Always begin with Zod schemas that match the m2mGatewaySpec exactly
- **Follow the pattern**: Use the same structure and naming conventions as existing categories
- **Validate everything**: Both input parameters and API responses should be validated
- **Type safety**: Ensure all TypeScript types are properly derived from validation schemas
- **Documentation**: Include JSDoc comments for all public methods
- **Error handling**: Let Zod validation errors bubble up for proper error reporting