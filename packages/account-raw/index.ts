import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKeyBuf =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
  return {
    VERSION: 0,
    getAddress() {
      return Promise.reject(new Error("not impl"));
    },
    getPublicKey() {
      return Promise.resolve(secp.getPublicKey(privKeyBuf));
    },
    sign(hash) {
      return secp
        .sign(new Uint8Array(hash), privKeyBuf)
        .then((array) => array.buffer);
    },
  };
}
