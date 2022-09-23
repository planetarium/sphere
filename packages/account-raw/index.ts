import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
  return {
    VERSION: 0,
    getAddress() {
      return Promise.resolve(
        secp.utils.bytesToHex(
          keccak_256(secp.getPublicKey(privKey, false).slice(1))
        )
      );
    },
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
