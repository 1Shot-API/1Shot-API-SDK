/// <reference types="jest" />

import { validateWebhook } from '../src/utils/webhook.js';

describe('validateWebhook', () => {
  // Placeholder data - replace with actual test data
  const mockWebhookData = {
    eventName: 'TransactionExecutionSuccess',
    data: {
      businessId: 'c7c34dd2-4068-45b3-b894-081bbe68944d',
      chain: 11155111,
      logs: [
        {
          args: [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0xD6AC871Ea68dD41774dA321B85e11D094b49aaa8',
            '0xA1BfEd6c6F1C3A516590edDAc7A8e359C2189A61',
          ],
          fragment: {
            anonymous: false,
            inputs: [
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'bytes32',
                components: null,
                indexed: true,
                name: 'role',
                type: 'bytes32',
              },
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'address',
                components: null,
                indexed: true,
                name: 'account',
                type: 'address',
              },
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'address',
                components: null,
                indexed: true,
                name: 'sender',
                type: 'address',
              },
            ],
            name: 'RoleGranted',
            type: 'event',
          },
          name: 'RoleGranted',
          signature: 'RoleGranted(bytes32,address,address)',
          topic: '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        },
        {
          args: [
            '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
            '0xD6AC871Ea68dD41774dA321B85e11D094b49aaa8',
            '0xA1BfEd6c6F1C3A516590edDAc7A8e359C2189A61',
          ],
          fragment: {
            anonymous: false,
            inputs: [
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'bytes32',
                components: null,
                indexed: true,
                name: 'role',
                type: 'bytes32',
              },
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'address',
                components: null,
                indexed: true,
                name: 'account',
                type: 'address',
              },
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'address',
                components: null,
                indexed: true,
                name: 'sender',
                type: 'address',
              },
            ],
            name: 'RoleGranted',
            type: 'event',
          },
          name: 'RoleGranted',
          signature: 'RoleGranted(bytes32,address,address)',
          topic: '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
        },
        {
          args: ['0xF78E26755A3b0749094222e22A7573DFB34239B7'],
          fragment: {
            anonymous: false,
            inputs: [
              {
                arrayChildren: null,
                arrayLength: null,
                baseType: 'address',
                components: null,
                indexed: false,
                name: 'token',
                type: 'address',
              },
            ],
            name: 'TokenCreated',
            type: 'event',
          },
          name: 'TokenCreated',
          signature: 'TokenCreated(address)',
          topic: '0x2e2b3f61b70d2d131b2a807371103cc98d51adcaa5e9a8f9c32658ad8426e74e',
        },
      ],
      transactionExecutionId: '66649fc5-0fb9-4f78-b9ef-49cf1e879a84',
      transactionExecutionMemo: 'This was a Token Creation',
      transactionId: 'fea091f5-b095-4b93-be68-ea82a3f682dd',
      transactionReceipt: {
        _type: 'TransactionReceipt',
        blobGasPrice: null,
        blobGasUsed: null,
        blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
        blockNumber: 8194926,
        contractAddress: null,
        cumulativeGasUsed: '8556474',
        from: '0xD6AC871Ea68dD41774dA321B85e11D094b49aaa8',
        gasPrice: '324086869',
        gasUsed: '284283',
        hash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
        index: 81,
        logs: [
          {
            _type: 'log',
            address: '0xF78E26755A3b0749094222e22A7573DFB34239B7',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x',
            index: 164,
            topics: [
              '0x1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e',
              '0x000000000000000000000000248c1e059619791d4743ebf84374edb311dc0306',
            ],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
          {
            _type: 'log',
            address: '0xF78E26755A3b0749094222e22A7573DFB34239B7',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x0000000000000000000000000000000000000000000000000000000000000000',
            index: 165,
            topics: [
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x000000000000000000000000d6ac871ea68dd41774da321b85e11d094b49aaa8',
            ],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
          {
            _type: 'log',
            address: '0xF78E26755A3b0749094222e22A7573DFB34239B7',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x',
            index: 166,
            topics: [
              '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              '0x000000000000000000000000d6ac871ea68dd41774da321b85e11d094b49aaa8',
              '0x000000000000000000000000a1bfed6c6f1c3a516590eddac7a8e359c2189a61',
            ],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
          {
            _type: 'log',
            address: '0xF78E26755A3b0749094222e22A7573DFB34239B7',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x',
            index: 167,
            topics: [
              '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d',
              '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
              '0x000000000000000000000000d6ac871ea68dd41774da321b85e11d094b49aaa8',
              '0x000000000000000000000000a1bfed6c6f1c3a516590eddac7a8e359c2189a61',
            ],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
          {
            _type: 'log',
            address: '0xF78E26755A3b0749094222e22A7573DFB34239B7',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x0000000000000000000000000000000000000000000000000000000000000001',
            index: 168,
            topics: ['0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2'],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
          {
            _type: 'log',
            address: '0xA1BfEd6c6F1C3A516590edDAc7A8e359C2189A61',
            blockHash: '0xf0f26e75db82bff79b8d8953a8fe7c0a73989cfd19acdd2ec146d9aa5df93bad',
            blockNumber: 8194926,
            data: '0x000000000000000000000000f78e26755a3b0749094222e22a7573dfb34239b7',
            index: 169,
            topics: ['0x2e2b3f61b70d2d131b2a807371103cc98d51adcaa5e9a8f9c32658ad8426e74e'],
            transactionHash: '0xd786ac72942402a36ab2c10cb957b2c1798ccf33342aa81142008d77be076497',
            transactionIndex: 81,
          },
        ],
        logsBloom:
          '0x00000004000000000000000000000000000000000008000000000000000000000000000000000004000000000000004000000800000000000000100000000000000000000000000000000008001000000000000200000000000000000000000000000000020000000000008000000800000000000000000000000010001000000000000010000000000800000000080000000000000080000040000000000400000000000000000000000000000000400000010000000000001000000010000000000002000008000200000000000000001000000004000100800000480020000000000000000000002000000000000000000000000000001000000000000000',
        status: 1,
        to: '0xA1BfEd6c6F1C3A516590edDAc7A8e359C2189A61',
      },
      userId: null,
    },
    timestamp: 1745612823,
    apiVersion: 0,
    signature:
      'RJQWQ17rK3GaiWynqywRLcSP0MZ1Xkaqs/teq0kmGJ53usGxcM9SMPJ0vKNkWg8nhEreYUx8UBjRDFYdNzI6BA==',
  };

  const mockPublicKey = 'XwYzNu1y0v5uyWbWdAd6uKVGov4zOFdwtvQWbTs3t4I=';

  it('should return true for valid signatures', async () => {
    const isValid = await validateWebhook(mockWebhookData, mockPublicKey);
    expect(isValid).toBe(true);
  });

  it('should return false for missing signature', async () => {
    // Create a new object without the signature property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signature, ...dataWithoutSignature } = mockWebhookData;

    const isValid = await validateWebhook(dataWithoutSignature, mockPublicKey);
    expect(isValid).toBe(false);
  });

  it('should return false for invalid signatures', async () => {
    const dataWithInvalidSignature = {
      ...mockWebhookData,
      signature: 'invalid-signature',
    };

    const isValid = await validateWebhook(dataWithInvalidSignature, mockPublicKey);
    expect(isValid).toBe(false);
  });

  it('should return false for invalid public key', async () => {
    const isValid = await validateWebhook(mockWebhookData, 'invalid-public-key');
    expect(isValid).toBe(false);
  });
});
