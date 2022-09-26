import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
  return {
    VERSION: 0,
    getPublicKey() {
      return Promise.resolve(secp.getPublicKey(privKey));
    },
    sign(hash) {
      return secp
        .sign(new Uint8Array(hash), privKey)
        .then((array) => array.buffer);
    },
  };
}
