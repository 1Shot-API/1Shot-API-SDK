# @1shotapi/client-sdk

TypeScript client SDK for the [1Shot API](https://1shotapi.com). It provides a strongly typed REST client for the M2M (machine-to-machine) Gateway API and a utility for verifying webhook signatures.

This README is structured as a **second source of documentation** for how 1Shot API works, with examples for each area. For the full picture, see the [official 1Shot docs](https://docs.1shotapi.com/) and the [OpenAPI specification (m2mGatewaySpec.yaml)](https://github.com/1Shot-API/1Shot-API-SDK/blob/main/m2mGatewaySpec.yaml).

**API reference:** The M2M Gateway API is described in the [m2mGatewaySpec.yaml](https://github.com/1Shot-API/1Shot-API-SDK/blob/main/m2mGatewaySpec.yaml) in the SDK repository.

---

## Table of contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [Server Wallets](#1-server-wallets)
4. [Smart Contracts](#2-smart-contracts)
5. [Executing Transactions](#3-executing-transactions)
6. [Chains](#4-chains)
7. [Webhooks](#5-webhooks)
8. [Webhook verification](#webhook-verification)
9. [Error handling](#error-handling)
10. [Type safety](#type-safety)
11. [Publishing](#publishing)
12. [Contributing](#contributing)
13. [License](#license)

---

## Installation

```bash
npm install @1shotapi/client-sdk
```

---

## Quick start

```typescript
import { OneShotClient } from "@1shotapi/client-sdk";

const client = new OneShotClient({
  apiKey: "your_api_key",
  apiSecret: "your_api_secret",
});

// Optional: use a different base URL (e.g. for staging)
// const client = new OneShotClient({
//   apiKey: "your_api_key",
//   apiSecret: "your_api_secret",
//   baseUrl: "https://api.staging.1shotapi.com/v0",
// });
```

All examples below assume you have a `client` instance and a `businessId` (your 1Shot API business UUID).

---

## 1. Server Wallets

1Shot API uses **server wallets** to sign and send transactions on your behalf. You create and manage them per business and chain.

### 1.1 Create server wallet

Create a new server wallet for a business on a given chain.

```typescript
const wallet = await client.wallets.create("your_business_id", {
  chainId: 8453, // Base mainnet
  name: "Payments wallet",
  description: "Used for consumer payouts",
});
// wallet.id, wallet.address, wallet.chainId, etc.
```

### 1.2 List server wallets

List wallets for a business with optional filters and pagination.

```typescript
const { response, page, pageSize, totalResults } = await client.wallets.list(
  "your_business_id",
  {
    chainId: 8453,
    page: 1,
    pageSize: 20,
  }
);
```

### 1.3 Update server wallet metadata

Update name and description of an existing wallet.

```typescript
const updated = await client.wallets.update("your_wallet_id", {
  name: "Updated name",
  description: "Updated description",
});
```

### 1.4 Get signatures from server wallets

Server wallets can produce **EIP-3009** and **Permit2** signatures for transfer flows (e.g. gasless approvals), **EIP-712** typed data via `signTypedData` (`eth_signTypedData_v4`), and **EIP-191** plain-text messages via `signMessage` (`personal_sign`). For Permit2, you must first authorize the wallet for it, which requires running a transaction. The wallet must have gas in it in order to run the authorize transaction.

**EIP-3009**

```typescript
const sig = await client.wallets.getSignature(
  "your_wallet_id",
  "erc3009",
  {
    contractAddress: "0x...", // token contract
    destinationAddress: "0x...",
    amount: "1000000000000000000",
  }
);
// sig.signature, sig.deadline, etc.
```

**Permit2**

```typescript
const sig = await client.wallets.getSignature(
  "your_wallet_id",
  "permit2",
  {
    contractAddress: "0x...",
    destinationAddress: "0x...",
    amount: "1000000",
    validUntil: Math.floor(Date.now() / 1000) + 3600,
    validAfter: 0,
  }
);
```

**EIP-712 (`signTypedData`)**

Sign arbitrary EIP-712 typed data with the server wallet. The SDK uses **POST** so large payloads are not limited by URL length. The request body uses **`message`** as the typed-data root: `{ primaryType, message: { …struct fields } }`. Omit `EIP712Domain` from `types` if your tooling adds it—the API strips it before signing.

```typescript
const sig = await client.wallets.signTypedData("your_wallet_id", {
  domain: {
    name: "MyApp",
    version: "1",
    chainId: 1,
    verifyingContract: "0x0000000000000000000000000000000000000000",
  },
  types: {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
  },
  message: {
    primaryType: "Person",
    message: {
      name: "Alice",
      wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
  },
});
// sig.signature — hex; sig.data — JSON describing what was signed
```

**EIP-191 (`signMessage`)**

Sign a plain UTF-8 string (EIP-191 personal message). **POST** is used so long text is not limited by URL length.

```typescript
const sig = await client.wallets.signMessage("your_wallet_id", {
  message: "Login to MyApp as user@example.com",
});
// sig.signature — hex; sig.data — the message that was signed
```

**Authorize Permit2**

Authorize a wallet for Permit2 for a given token so it can perform Permit2 transfers without a new signature every time. **The wallet must have gas (native token) to run the authorize transaction.**

```typescript
const { success } = await client.wallets.authorizePermit2("your_wallet_id", {
  contractAddress: "0x...", // token contract, e.g. USDC
});
```

### 1.5 Delegations

Delegations let another address (delegate) act on behalf of the wallet within constraints (time, contracts, methods). Useful for agent or user-scoped permissions.

**Create delegation**

```typescript
const delegation = await client.wallets.createDelegation("your_wallet_id", {
  delegationData: "<signed delegation payload from your signer>",
  startTime: Math.floor(Date.now() / 1000),
  endTime: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
  contractAddresses: ["0x..."],
  methods: ["transfer", "approve"],
});
```

**List delegations**

```typescript
const { response, page, pageSize, totalResults } =
  await client.wallets.listDelegations("your_wallet_id", {
    page: 1,
    pageSize: 10,
  });
```

**Redelegate — from stored delegation**

Create a new delegation from an existing one (by ID); the current delegate signs the redelegation to a new delegate.

```typescript
const { parent, redelegation } = await client.wallets.redelegate(
  "existing_delegation_id",
  { delegateAddress: "0xNewDelegate..." }
);
// Use parent and redelegation in delegationData when executing as delegator
```

**Redelegate — from provided delegation**

Same idea when you have the parent delegation as JSON instead of an ID (e.g. to fan out one delegation to many server wallets).

```typescript
const { parent, redelegation } = await client.wallets.redelegateWithDelegationData(
  "wallet_id_that_is_current_delegate",
  {
    delegationData: "<parent delegation JSON string>",
    delegateAddress: "0xNewDelegate...",
  }
);
```

---

## 2. Smart Contracts

1Shot API lets you **search** for contracts, **assure** that imported contract methods exist for a contract (via prompts), and work with **contract methods** and **contract events** attached to your business.

### 2.1 Search smart contracts

Search for contracts by natural language or identifiers; returns prompts you can use with “assure” or to import methods.

```typescript
const prompts = await client.contractMethods.search("USDC on Base", {
  chainId: 8453,
});
// prompts[].promptId, prompts[].name, etc.
```

### 2.2 Assure methods associated with smart contract

Ensure contract methods exist for a given contract (and optional prompt). Creates or returns the methods so you can execute or read them.

```typescript
const methods = await client.contractMethods.assureContractMethodsFromPrompt(
  "your_business_id",
  {
    chainId: 8453,
    contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
    walletId: "your_wallet_id",
    promptId: "optional_prompt_uuid", // omit to use highest-ranked prompt
  }
);
```

### 2.3 Contract Methods

**Listing imported contract methods**

List contract methods for a business with optional filters.

```typescript
const { response, page, pageSize, totalResults } =
  await client.contractMethods.list("your_business_id", {
    chainId: 8453,
    contractAddress: "0x...",
    page: 1,
    pageSize: 20,
    status: "live",
  });
```

**Update imported contract method details**

Update metadata or configuration of an imported contract method.

```typescript
const updated = await client.contractMethods.update("your_contract_method_id", {
  name: "Transfer USDC",
  description: "Sends USDC to a recipient",
  walletId: "another_wallet_id",
});
```

**Reading from read contract methods**

Call view/pure contract methods without sending a transaction. Returns decoded result.

```typescript
const balance = await client.contractMethods.read(
  "your_contract_method_id", // e.g. balanceOf
  {
    owner: "0x1234567890123456789012345678901234567890",
  }
);
```

**Simulating write contract methods**

Simulate a write (or any) contract method without submitting a transaction. Useful for validation and gas/result estimation.

```typescript
const result = await client.contractMethods.test(
  "your_contract_method_id",
  { amount: "1000000", recipient: "0x..." },
  { value: "0" }
);
// result.success, result.data, etc.
```

### 2.4 Contract Events

**Listing imported contract events**

List contract event definitions for a business.

```typescript
const { response, page, pageSize, totalResults } =
  await client.contractEvents.list("your_business_id", {
    chainId: 8453,
    contractAddress: "0x...",
    page: 1,
    pageSize: 20,
  });
```

**Update imported contract event details**

Update name or description of a contract event definition.

```typescript
const updated = await client.contractEvents.update("your_contract_event_id", {
  name: "Transfer events",
  description: "ERC20 Transfer(indexed from, indexed to, value)",
});
```

**Querying contract events with indexed arguments**

Query blockchain logs for a contract event definition, with optional block range and indexed argument filters.

```typescript
const { logs } = await client.contractEvents.searchLogs(
  "your_contract_event_id",
  {
    startBlock: 12_000_000,
    endBlock: 12_100_000,
    topics: {
      from: "0x1234567890123456789012345678901234567890",
      to: "0xabcdef0123456789abcdef0123456789abcdef01",
    },
  }
);
// logs[].eventName, logs[].blockNumber, logs[].topics, etc.
```

---

## 3. Executing Transactions

Execution is done via **contract methods**: you call the method by ID with params and (optionally) a wallet, memo, value, etc. You can run a single call, a single call as a delegator, or batches in one transaction.

### 3.1 Single execute

Execute one contract method with a server wallet.

```typescript
const transaction = await client.contractMethods.execute(
  "your_contract_method_id",
  {
    recipient: "0x1234567890123456789012345678901234567890",
    amount: "1000000000000000000",
  },
  {
    walletId: "your_wallet_id",
    memo: "Payout #123",
    value: "0",
  }
);
// transaction.id, transaction.status, etc.
```

### 3.2 Delegated single execute

Execute one contract method as a **delegator**: the signer of the transaction is the delegate (e.g. agent or user wallet), using a delegation you created earlier. Provide exactly one of `delegatorAddress`, `delegationId`, or `delegationData`.

```typescript
const transaction = await client.contractMethods.executeAsDelegator(
  "your_contract_method_id",
  { recipient: "0x...", amount: "1000000" },
  {
    walletId: "wallet_id",
    delegationData: ["<parent JSON>", "<redelegation JSON>"],
    memo: "Delegated transfer",
  }
);
```

### 3.3 Batch execute

Execute multiple contract methods in one transaction from a single server wallet. Use `atomic: true` so the whole batch reverts if any step fails.

```typescript
const transaction = await client.contractMethods.executeBatch({
  walletId: "your_wallet_id",
  contractMethods: [
    {
      contractMethodId: "method_uuid_1",
      executionIndex: 0,
      params: { recipient: "0x...", amount: "100" },
    },
    {
      contractMethodId: "method_uuid_2",
      executionIndex: 1,
      params: { spender: "0x...", amount: "200" },
    },
  ],
  atomic: true,
  memo: "Batch approval + transfer",
});
```

### 3.4 Delegated batch execute

Same as batch execute, but each item can specify delegator info so the batch runs as delegator(s).

```typescript
const transaction = await client.contractMethods.executeBatchAsDelegator({
  walletId: "wallet_id",
  contractMethods: [
    {
      contractMethodId: "method_uuid_1",
      executionIndex: 0,
      params: { recipient: "0x...", amount: "100" },
      delegatorAddress: "0xDelegate...",
      // or delegationId / delegationData
    },
  ],
  atomic: true,
});
```

---

## 4. Chains

`client.chains` covers everything in the **Chains** category of the M2M API: listing networks 1Shot supports, current gas fee estimates, and inspecting bytecode at an address (including EIP-7702 delegation).

### 4.1 List chains (`list`)

Returns a paginated list of supported chains. Each item includes `name`, `chainId`, `averageBlockMiningTime`, `nativeCurrency` (`name`, `symbol`, `decimals`), and `type` (`Mainnet`, `Testnet`, or `Hardhat`).

```typescript
const { response, page, pageSize, totalResults } = await client.chains.list({
  page: 1,
  pageSize: 25,
});
// response[].chainId, response[].name, response[].nativeCurrency.symbol, ...
```

### 4.2 Gas fees (`getFees`)

Returns current gas pricing for a chain. For **EIP-1559** chains you typically get `maxFeePerGas` and `maxPriorityFeePerGas` (wei strings); for **legacy** style chains you may get `gasPrice` instead.

```typescript
const fees = await client.chains.getFees(8453);
// fees.gasPrice — legacy chains, or null on EIP-1559
// fees.maxFeePerGas, fees.maxPriorityFeePerGas — EIP-1559, or null on legacy
```

### 4.3 Contract bytecode (`getCode`)

Returns whether the address has contract bytecode on the chain (`eth_getCode`) and, when the bytecode matches the EIP-7702 delegation designator (`0xef0100` + 20-byte implementation address), the **delegated implementation** contract address. This counts against the same monthly read quota as reading a contract method.

```typescript
const codeInfo = await client.chains.getCode(
  8453, // Base mainnet
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
);
// codeInfo.isContract — true if non-empty bytecode
// codeInfo.eip7702ImplementationAddress — implementation contract when EIP-7702 delegation bytecode; otherwise null
```

---

## 5. Webhooks

1Shot API lets you manage **webhook endpoints** (URLs that receive payloads) and **webhook triggers** (rules that decide when to send those payloads). You can list event names, create and update endpoints and triggers, rotate endpoint keys, and inspect generated webhooks and delivery attempts.

### 5.1 Get available webhook event names

List event names that may trigger webhooks (e.g. `TransactionExecutionSuccess`, `TransactionExecutionFailure`).

```typescript
const { events } = await client.webhooks.getEvents();
// events: ("TransactionExecutionFailure" | "TransactionExecutionSuccess" | ...)[]
```

### 5.2 Webhook triggers

**List webhook triggers**

List all triggers for a business with optional pagination.

```typescript
const { response, page, pageSize, totalResults } =
  await client.webhooks.listTriggers("your_business_id", {
    page: 1,
    pageSize: 25,
  });
```

**Create webhook trigger**

Create a trigger that sends webhooks to an endpoint when certain events occur. Optionally restrict by contract method IDs.

```typescript
const trigger = await client.webhooks.createTrigger("your_business_id", {
  endpointId: "your_webhook_endpoint_id",
  eventNames: ["TransactionExecutionSuccess", "TransactionExecutionFailure"],
  name: "Transaction notifications",
  description: "Notify on success or failure",
  contractMethodIds: ["method_uuid_1", "method_uuid_2"], // optional
});
```

**Update webhook trigger**

Update an existing trigger’s endpoint, events, name, or description.

```typescript
const updated = await client.webhooks.updateTrigger("your_webhook_trigger_id", {
  eventNames: ["TransactionExecutionSuccess"],
  name: "Success only",
});
```

**Delete webhook trigger**

```typescript
const { success } = await client.webhooks.deleteTrigger("your_webhook_trigger_id");
```

### 5.3 Webhook endpoints

**List webhook endpoints**

List all endpoints for a business (the URLs that receive webhook payloads).

```typescript
const { response, page, pageSize, totalResults } =
  await client.webhooks.listEndpoints("your_business_id", {
    page: 1,
    pageSize: 25,
  });
```

**Create webhook endpoint**

Register a URL to receive webhooks. The response includes a `publicKey` for verifying signatures.

```typescript
const endpoint = await client.webhooks.createEndpoint("your_business_id", {
  destinationUrl: "https://your-app.com/webhooks/1shot",
  name: "Production webhook",
  description: "Receives transaction and balance events",
});
// endpoint.id, endpoint.publicKey, endpoint.destinationUrl, etc.
```

**Get webhook endpoint**

Fetch a single endpoint by ID.

```typescript
const endpoint = await client.webhooks.getEndpoint("your_webhook_endpoint_id");
```

**Update webhook endpoint**

Update name or description (URL cannot be changed).

```typescript
const updated = await client.webhooks.updateEndpoint("your_webhook_endpoint_id", {
  name: "Production (primary)",
  description: "Updated description",
});
```

**Delete webhook endpoint**

```typescript
const { success } = await client.webhooks.deleteEndpoint("your_webhook_endpoint_id");
```

**Rotate webhook endpoint key**

Rotate the private key for an endpoint. Returns the endpoint with a new `publicKey`; use it to verify future webhook signatures.

```typescript
const endpoint = await client.webhooks.rotateEndpointKey("your_webhook_endpoint_id");
// endpoint.publicKey is the new key; update your verification config
```

### 5.4 Webhook deliveries and attempts

**List webhooks for an endpoint**

List generated webhook deliveries for a specific endpoint (with optional pagination).

```typescript
const { response, page, pageSize, totalResults } =
  await client.webhooks.listWebhooksForEndpoint("your_webhook_endpoint_id", {
    page: 1,
    pageSize: 25,
  });
// response[].id, response[].eventName, response[].content, response[].status
```

**List delivery attempts for a webhook**

List delivery attempts for a single webhook (e.g. to debug failures).

```typescript
const { response, page, pageSize, totalResults } =
  await client.webhooks.listDeliveryAttempts("your_webhook_id", {
    page: 1,
    pageSize: 25,
  });
// response[].httpResponse, response[].clientResponse, response[].timestamp
```

---

## Webhook validation

1Shot API can send webhooks for transaction state changes. Verify signatures using the provided utility to make sure they are coming from 1Shot API.

### Using the standalone function

```typescript
import { validateWebhook } from "@1shotapi/client-sdk";
import express from "express";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const body = req.body;

  const publicKey = "your_webhook_public_key";

  try {
    const isValid = await validateWebhook({
      body,
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

---

## Error handling

The client can throw:

- **RequestError** – HTTP request failures
- **ZodError** – Invalid parameters (from schema validation)
- **InvalidSignatureError** – Invalid webhook signatures (from `validateWebhook`)

---

## Type safety

All API methods and responses are typed. Models and options align with the [M2M Gateway API spec](https://github.com/1Shot-API/1Shot-API-SDK/blob/main/m2mGatewaySpec.yaml).

---

## Publishing

1. Bump the version in `package.json`.
2. Build: `npm run build`
3. Test the tarball: `npm pack` then install the generated `.tgz`.
4. Publish: `npm publish` (after `npm login` if needed).

---

## Contributing

Contributions are welcome. Please open a Pull Request.

---

## License

This project is licensed under the MIT License – see the LICENSE file for details.
