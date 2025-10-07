/// <reference types="jest" />

import {
  executeContractMethodSchema,
  readContractMethodSchema,
  testContractMethodSchema,
} from '../src/validation/contractMethod.js';

describe('Parameter validation test', () => {
  // Placeholder data - replace with actual test data
  const mockParams = {
    batchCall: {
      calls: [
        {
          data: '0xa9059cbb00000000000000000000000026a529124f0bbf9af9d8f9f84a43efe47cf1199a000000000000000000000000000000000000000000000000000000000012d687',
          target: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
          value: '0', // Convert BigInt to string
        },
      ],
      nonce: '123', // Convert BigInt to string
    },
    validatorData: '0x01',
  };

  const mockContractMethodId = '00000000-0000-0000-0000-000000000000';

  it('should pass validation', async () => {
    const parsedParams = testContractMethodSchema.parse({
      contractMethodId: mockContractMethodId, // Fix: use correct property name
      params: mockParams,
    });

    expect(parsedParams).toBeDefined();
  });
});

describe('Read contractMethod test', () => {
  // Placeholder data - replace with actual test data
  const mockParams = {
    secondsAgos: ['0', '360'],
  };

  const mockContractMethodId = '5857f83d-7d65-4614-9731-bdd238b01120';

  it('should pass validation', async () => {
    const parsedParams = readContractMethodSchema.parse({
      contractMethodId: mockContractMethodId, // Fix: use correct property name
      params: mockParams,
    });

    expect(parsedParams).toBeDefined();
  });
});

describe('Execute contractMethod test', () => {
  // Placeholder data - replace with actual test data
  const mockParams = {
    secondsAgos: ['0', '360'],
  };

  const mockContractMethodId = '5857f83d-7d65-4614-9731-bdd238b01120';

  it('should pass validation', async () => {
    const parsedParams = executeContractMethodSchema.parse({
      contractMethodId: mockContractMethodId, // Fix: use correct property name
      params: mockParams,
    });

    expect(parsedParams).toBeDefined();
  });
});
