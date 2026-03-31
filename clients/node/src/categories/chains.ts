import { ChainInfo, ListChains, GasFees, ContractCodeInfo } from "../types/chain.js";
import { IOneShotClient } from "../types/client.js";
import { PagedResponse } from "../types/common.js";
import {
  chainListSchema,
  listChainsSchema,
  gasFeesSchema,
  getFeesSchema,
  contractCodeInfoSchema,
  getCodeSchema,
} from "../validation/chain.js";

export class Chains {
  constructor(private client: IOneShotClient) {}

  /**
   * List all chains supported by 1Shot API
   * @param params Optional pagination parameters
   * @returns Promise<PagedResponse<ChainInfo>>
   * @throws {ZodError} If the parameters are invalid
   */
  async list(params?: ListChains): Promise<PagedResponse<ChainInfo>> {
    // Validate all parameters using the schema
    const validatedParams = listChainsSchema.parse(params || {});

    const queryParams = new URLSearchParams();
    if (validatedParams.pageSize != undefined) {
      queryParams.append("pageSize", validatedParams.pageSize.toString());
    }
    if (validatedParams.page != undefined) {
      queryParams.append("page", validatedParams.page.toString());
    }

    const queryString = queryParams.toString();
    const path = queryString ? `/chains?${queryString}` : "/chains";

    const response = await this.client.request<PagedResponse<ChainInfo>>("GET", path);

    // Validate the response
    return chainListSchema.parse(response);
  }

  /**
   * Get current gas fees (and optional fee history) for a specific chain.
   * @param chainId The ChainId of the chain to get fees for
   * @param options Optional parameters (e.g. numberOfBlocks for eth_feeHistory window)
   * @returns Promise<GasFees>
   * @throws {ZodError} If the parameters are invalid
   */
  async getFees(chainId: number, options?: { numberOfBlocks?: number }): Promise<GasFees> {
    // Validate all parameters using the schema
    const validatedParams = getFeesSchema.parse({
      chainId,
      ...options,
    });

    const queryParams = new URLSearchParams();
    if (validatedParams.numberOfBlocks !== undefined) {
      queryParams.append("numberOfBlocks", validatedParams.numberOfBlocks.toString());
    }
    const queryString = queryParams.toString();
    const path = queryString
      ? `/chains/${validatedParams.chainId}/fees?${queryString}`
      : `/chains/${validatedParams.chainId}/fees`;

    const response = await this.client.request<GasFees>("GET", path);

    // Validate the response
    return gasFeesSchema.parse(response);
  }

  /**
   * Inspect bytecode at an address on a chain (`eth_getCode`). When bytecode matches the EIP-7702
   * delegation designator (`0xef0100` + 20-byte implementation), returns the delegated implementation address.
   * Counts against the same monthly read quota as reading a contract method.
   * @param chainId Chain ID
   * @param address Contract or account address (checksummed or lower-case hex)
   * @returns Promise<ContractCodeInfo>
   * @throws {ZodError} If the parameters are invalid
   */
  async getCode(chainId: number, address: string): Promise<ContractCodeInfo> {
    const validated = getCodeSchema.parse({
      chainId,
      contractAddress: address,
    });

    const response = await this.client.request<ContractCodeInfo>(
      "GET",
      `/chains/${validated.chainId}/contracts/${validated.contractAddress}`
    );

    return contractCodeInfoSchema.parse(response);
  }
}
