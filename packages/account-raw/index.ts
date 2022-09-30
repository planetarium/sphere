import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
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
