import { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";

/**
 * account-raw
 *
 * Gets raw private key as input to create account.
 * if input private key is null, it randomly generates private key.
 */

export function isValidPrivateKey(privateKey: string | Uint8Array): boolean {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey;
  if (privKey.length !== 32 || !secp.utils.isValidPrivateKey(privKey)) {
    return false;
  } else {
    return true;
  }
}

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();

  if (isValidPrivateKey(privKey)) {
    return {
      VERSION: 0,
      getPublicKey(isCompressed) {
        return Promise.resolve(secp.getPublicKey(privKey, isCompressed));
      },
      sign(hash) {
        return secp.sign(hash, privKey);
      },
    };
  } else {
    throw new Error("Is not valid private key.");
  }
}
