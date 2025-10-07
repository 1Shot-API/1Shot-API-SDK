import { ChainInfo, ListChains, GasFees } from "../types/chain.js";
import { IOneShotClient } from "../types/client.js";
import { PagedResponse } from "../types/common.js";
import {
  chainListSchema,
  listChainsSchema,
  gasFeesSchema,
  getFeesSchema,
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
   * Get current gas fees for a specific chain
   * @param chainId The ChainId of the chain to get fees for
   * @returns Promise<GasFees>
   * @throws {ZodError} If the chainId is invalid
   */
  async getFees(chainId: number): Promise<GasFees> {
    // Validate all parameters using the schema
    const validatedParams = getFeesSchema.parse({
      chainId,
    });

    const response = await this.client.request<GasFees>(
      "GET",
      `/chains/${validatedParams.chainId}/fees`
    );

    // Validate the response
    return gasFeesSchema.parse(response);
  }
}
