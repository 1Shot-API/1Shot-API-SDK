import { z } from "zod/index.js";

import { IOneShotClient } from "../types/client.js";
import { PagedResponse } from "../types/common.js";
import { Transaction } from "../types/transaction.js";
import { Wallet, Delegation } from "../types/wallet.js";
import {
  walletSchema,
  walletListSchema,
  listWalletsSchema,
  createWalletSchema,
  getWalletSchema,
  updateWalletSchema,
  deleteWalletSchema,
  transferWalletSchema,
  delegationSchema,
  delegationListSchema,
  listDelegationsSchema,
  createDelegationSchema,
  deleteDelegationSchema,
} from "../validation/wallet.js";

const listWalletsSchemaOptions = listWalletsSchema.omit({ businessId: true });
const getWalletSchemaOptions = getWalletSchema.omit({ walletId: true });
const listDelegationsSchemaOptions = listDelegationsSchema.omit({ walletId: true });

export class Wallets {
  constructor(private client: IOneShotClient) {}

  /**
   * List wallets for a business
   * @param businessId The business ID to list wallets for
   * @param params Optional filter parameters
   * @returns Promise<PagedResponse<Wallet>>
   * @throws {ZodError} If the parameters are invalid
   */
  async list(
    businessId: string,
    params?: z.infer<typeof listWalletsSchemaOptions>
  ): Promise<PagedResponse<Wallet>> {
    // Validate all parameters using the schema
    const validatedParams = listWalletsSchema.parse({
      businessId,
      ...params,
    });

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    const path = queryString
      ? `/business/${validatedParams.businessId}/wallets?${queryString}`
      : `/business/${validatedParams.businessId}/wallets`;

    const response = await this.client.request<PagedResponse<Wallet>>("GET", path);

    // Validate the response
    return walletListSchema.parse(response);
  }

  /**
   * Create a new wallet for a business
   * @param businessId The business ID to create the wallet for
   * @param params Creation parameters including chainId, name, and optional description
   * @returns Promise<Wallet>
   * @throws {ZodError} If the parameters are invalid
   */
  async create(
    businessId: string,
    params: {
      chainId: number;
      name: string;
      description?: string;
    }
  ): Promise<Wallet> {
    // Validate all parameters using the schema
    const validatedParams = createWalletSchema.parse({
      businessId,
      ...params,
    });

    const response = await this.client.request<Wallet>(
      "POST",
      `/business/${validatedParams.businessId}/wallets`,
      {
        chainId: validatedParams.chainId,
        name: validatedParams.name,
        description: validatedParams.description,
      }
    );

    // Validate the response
    return walletSchema.parse(response);
  }

  /**
   * Get a wallet by ID
   * @param walletId The ID of the wallet to get
   * @param includeBalances Whether to include balance information
   * @returns Promise<Wallet>
   * @throws {ZodError} If the parameters are invalid
   */
  async get(
    walletId: string,
    includeBalances?: z.infer<typeof getWalletSchemaOptions>
  ): Promise<Wallet> {
    // Validate all parameters using the schema
    const validatedParams = getWalletSchema.parse({
      walletId,
      includeBalances,
    });

    const queryParams = new URLSearchParams();
    if (validatedParams.includeBalances != undefined) {
      queryParams.append("includeBalances", validatedParams.includeBalances.toString());
    }
    const queryString = queryParams.toString();
    const path = queryString
      ? `/wallets/${validatedParams.walletId}?${queryString}`
      : `/wallets/${validatedParams.walletId}`;

    const response = await this.client.request<Wallet>("GET", path);

    // Validate the response
    return walletSchema.parse(response);
  }

  /**
   * Update a wallet
   * @param walletId The ID of the wallet to update
   * @param params Update parameters
   * @returns Promise<Wallet>
   * @throws {ZodError} If the parameters are invalid
   */
  async update(
    walletId: string,
    params: {
      name?: string;
      description?: string;
    }
  ): Promise<Wallet> {
    // Validate all parameters using the schema
    const validatedParams = updateWalletSchema.parse({
      walletId,
      ...params,
    });

    const response = await this.client.request<Wallet>(
      "PUT",
      `/wallets/${validatedParams.walletId}`,
      {
        name: validatedParams.name,
        description: validatedParams.description,
      }
    );

    // Validate the response
    return walletSchema.parse(response);
  }

  /**
   * Delete a wallet
   * @param walletId The ID of the wallet to delete
   * @returns Promise<{ success: boolean }>
   * @throws {ZodError} If the wallet ID is invalid
   */
  async delete(walletId: string): Promise<{ success: boolean }> {
    // Validate all parameters using the schema
    const validatedParams = deleteWalletSchema.parse({
      walletId,
    });

    return this.client.request<{ success: boolean }>(
      "DELETE",
      `/wallets/${validatedParams.walletId}`
    );
  }

  /**
   * Transfer native tokens from a wallet
   * @param walletId The ID of the wallet to transfer funds from
   * @param params Transfer parameters including destination address, optional amount, and optional memo
   * @returns Promise<Transaction>
   * @throws {ZodError} If the parameters are invalid
   */
  async transfer(
    walletId: string,
    params: {
      destinationAccountAddress: string;
      transferAmount?: string;
      memo?: string;
    }
  ): Promise<Transaction> {
    // Validate all parameters using the schema
    const validatedParams = transferWalletSchema.parse({
      walletId,
      ...params,
    });

    const response = await this.client.request<Transaction>(
      "POST",
      `/wallets/${validatedParams.walletId}/transfer`,
      {
        destinationAccountAddress: validatedParams.destinationAccountAddress,
        transferAmount: validatedParams.transferAmount,
        memo: validatedParams.memo,
      }
    );

    // Return the response (Transaction type is already validated by the API)
    return response;
  }

  /**
   * List delegations for a wallet
   * @param walletId The ID of the wallet to list delegations for
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<Delegation>>
   * @throws {ZodError} If the parameters are invalid
   */
  async listDelegations(
    walletId: string,
    params?: z.infer<typeof listDelegationsSchemaOptions>
  ): Promise<PagedResponse<Delegation>> {
    // Validate all parameters using the schema
    const validatedParams = listDelegationsSchema.parse({
      walletId,
      ...params,
    });

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    const path = queryString
      ? `/wallets/${validatedParams.walletId}/delegations?${queryString}`
      : `/wallets/${validatedParams.walletId}/delegations`;

    const response = await this.client.request<PagedResponse<Delegation>>("GET", path);

    // Validate the response
    return delegationListSchema.parse(response);
  }

  /**
   * Create a new delegation for a wallet
   * @param walletId The ID of the wallet to create the delegation for
   * @param params Delegation creation parameters
   * @returns Promise<Delegation>
   * @throws {ZodError} If the parameters are invalid
   */
  async createDelegation(
    walletId: string,
    params: {
      delegationData: string;
      startTime?: number;
      endTime?: number;
      contractAddresses?: string[];
      methods?: string[];
    }
  ): Promise<Delegation> {
    // Validate all parameters using the schema
    const validatedParams = createDelegationSchema.parse({
      walletId,
      ...params,
    });

    const response = await this.client.request<Delegation>(
      "POST",
      `/wallets/${validatedParams.walletId}/delegations`,
      {
        startTime: validatedParams.startTime,
        endTime: validatedParams.endTime,
        contractAddresses: validatedParams.contractAddresses,
        methods: validatedParams.methods,
        delegationData: validatedParams.delegationData,
      }
    );

    // Validate the response
    return delegationSchema.parse(response);
  }

  /**
   * Delete a delegation by its ID
   * @param delegationId The ID of the delegation to delete
   * @returns Promise<{ success: boolean }>
   * @throws {ZodError} If the delegation ID is invalid
   */
  async deleteDelegation(delegationId: string): Promise<{ success: boolean }> {
    // Validate all parameters using the schema
    const validatedParams = deleteDelegationSchema.parse({
      delegationId,
    });

    return this.client.request<{ success: boolean }>(
      "DELETE",
      `/delegation/${validatedParams.delegationId}`
    );
  }
}
