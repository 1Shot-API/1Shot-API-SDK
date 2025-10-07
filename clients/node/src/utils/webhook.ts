import { verify, etc } from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";

// Initialize the ed25519 library with SHA-512
etc.sha512Sync = (...m) => sha512(etc.concatBytes(...m));

/**
 * Recursively sorts object keys alphabetically
 * @param obj - The object to sort
 * @returns A new object with sorted keys
 */
function sortObjectKeys(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key: string) => {
      result[key] = sortObjectKeys(obj[key]);
      return result;
    }, {});
}

/**
 * Validates a webhook signature using ED25519.
 * This utility verifies that the webhook data was signed by the 1Shot API using the provided public key.
 *
 * @param data - The webhook data object (should include all fields except the signature)
 * @param publicKey - The base64-encoded public key provided by 1Shot
 * @returns boolean - True if the signature is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = validateWebhook(webhookData, "SBLzVF0dHNo/6tXo3+UOsYnCJ3Brq/SNxAFOAMWxTVo=");
 * if (isValid) {
 *   // Process the webhook
 * } else {
 *   // Reject the webhook
 * }
 * ```
 */
export async function validateWebhook(
  data: Record<string, any>,
  publicKey: string
): Promise<boolean> {
  try {
    // Extract the signature from the data
    const { signature, ...dataWithoutSignature } = data;

    if (signature == null) {
      return false;
    }

    // Convert the public key from base64 to bytes
    const publicKeyBytes = Buffer.from(publicKey, "base64");

    // Convert the signature from base64 to bytes
    const signatureBytes = Buffer.from(signature, "base64");

    // Sort all object keys recursively and create a canonical JSON string
    const sortedData = sortObjectKeys(dataWithoutSignature);
    const message = JSON.stringify(sortedData);

    // Convert the message to UTF-8 bytes
    const messageBytes = new TextEncoder().encode(message);

    // Verify the signature
    return await verify(signatureBytes, messageBytes, publicKeyBytes);
  } catch (error) {
    // If any error occurs during validation, return false
    return false;
  }
}
