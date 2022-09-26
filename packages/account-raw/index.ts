import type { Account } from "@planetarium/sign";
import * as secp from "@noble/secp256k1";
import { keccak_256 } from "@noble/hashes/sha3";

// Source: https://github.com/VictorTaelin/eth-lib/blob/da0971f5b09964d9c8449975fa87933f0c9fef35/src/account.js#L15
function toChecksum(address: string) {
  const addressHash = secp.utils.bytesToHex(keccak_256(address));
  let checksumAddress = "";
  for (let i = 0; i < address.length; i++)
    checksumAddress +=
      parseInt(addressHash[i], 16) > 7 ? address[i].toUpperCase() : address[i];
  return checksumAddress;
}

export function createAccount(privateKey?: string | Uint8Array): Account {
  const privKey =
    typeof privateKey === "string"
      ? secp.utils.hexToBytes(privateKey)
      : privateKey ?? secp.utils.randomPrivateKey();
  return {
    VERSION: 0,
    getAddress() {
      return Promise.resolve(
        "0x" +
          toChecksum(
            secp.utils
              .bytesToHex(
                keccak_256(secp.getPublicKey(privKey, false).slice(1))
              )
              .slice(-40)
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
