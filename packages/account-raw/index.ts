import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";

/**
 * account-raw
 *
 * Gets raw private key as input to create account.
 * if input private key is null, it randomly generates private key.
 */

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
  if (!secp.utils.isValidPrivateKey(privKey)){
    throw new Error(`Is not valid private key.`)
  }
  if (privKey.length !== 32){
    throw new Error(`Expected 32 bytes of private key, got ${privKey.length}`)
  }

  return {
    VERSION: 0,
    getPublicKey(isCompressed) {
      return Promise.resolve(secp.getPublicKey(privKey, isCompressed));
    },
    sign(hash) {
      return secp.sign(hash, privKey);
    },
  };
}
