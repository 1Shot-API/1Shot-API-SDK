# @1shotapi/client-sdk

TypeScript client SDK for the [1Shot API](https://1shotapi.com). It provides a strongly typed REST client and a utility for verifying webhook signatures.

**API reference:** The M2M Gateway API is described in the [OpenAPI specification (m2mGatewaySpec.yaml)](https://github.com/1Shot-API/1Shot-API-SDK/blob/main/m2mGatewaySpec.yaml).

## Installation

```bash
npm install @1shotapi/client-sdk
```

## Usage

### REST Client

```typescript
import { OneShotClient } from "@1shotapi/client-sdk";

// Initialize the client
const client = new OneShotClient({
  apiKey: "your_api_key",
  apiSecret: "your_api_secret",
});
```

### Contract Methods

```typescript
// List contract methods for a business (businessId first, optional filters second)
const listResult = await client.contractMethods.list("your_business_id", {
  page: 1,
  pageSize: 10,
  chainId: 1,
  status: "live",
});

// Get a single contract method by ID
const contractMethod = await client.contractMethods.get("your_contract_method_id");

// Execute a contract method (contractMethodId, params, optional options)
const transaction = await client.contractMethods.execute(
  "your_contract_method_id",
  {
    amount: "1000000000000000000",
    recipient: "0x1234567890123456789012345678901234567890",
  },
  {
    walletId: "optional_wallet_id",
    memo: "Optional note for this execution",
    value: "0", // For payable methods
  }
);

// Read the result of a view or pure function (no transaction, no gas)
const result = await client.contractMethods.read("your_contract_method_id", {
  owner: "0x1234567890123456789012345678901234567890",
});
// result is the decoded return value (e.g. balance, token URI)

// Test a contract method without executing (simulation)
const testResult = await client.contractMethods.test(
  "your_contract_method_id",
  { amount: "1000000", recipient: "0x..." },
  { value: "0" }
);

// Estimate gas for an execution
const estimate = await client.contractMethods.estimate(
  "your_contract_method_id",
  { amount: "1000000", recipient: "0x..." }
);

// Create a new contract method
const newMethod = await client.contractMethods.create("your_business_id", {
  chainId: 1,
  contractAddress: "0x...",
  walletId: "your_wallet_id",
  name: "Transfer Tokens",
  description: "Transfers ERC20 tokens to a recipient",
  functionName: "transfer",
  stateMutability: "nonpayable",
  inputs: [
    { name: "recipient", type: "address", index: 0 },
    { name: "amount", type: "uint256", index: 1 },
  ],
  outputs: [],
});
```

### Webhook Verification

#### Using the standalone function

```typescript
import { verifyWebhook } from "@1shotapi/client-sdk";
import express from "express";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const body = req.body;
  const signature = body.signature;
  delete body.signature;

  if (!signature) {
    return res.status(400).json({ error: "Signature missing" });
  }

  const publicKey = "your_webhook_public_key";

  try {
    const isValid = verifyWebhook({
      body,
      signature,
      publicKey,
    });

    if (!isValid) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    return res.json({ message: "Webhook verified successfully" });
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
});
```

## Error handling

The client can throw:

- **RequestError** – HTTP request failures
- **ZodError** – Invalid parameters (from schema validation)
- **InvalidSignatureError** – Invalid webhook signatures (from `verifyWebhook`)

## Type safety

All API methods and responses are typed. Models and options align with the [M2M Gateway API spec](https://github.com/1Shot-API/1Shot-API-SDK/blob/main/m2mGatewaySpec.yaml).

## Publishing

1. Bump the version in `package.json`.
2. Build: `npm run build`
3. Test the tarball: `npm pack` then install the generated `.tgz`.
4. Publish: `npm publish` (after `npm login` if needed).

## Contributing

Contributions are welcome. Please open a Pull Request.

## License

This project is licensed under the MIT License – see the LICENSE file for details.
