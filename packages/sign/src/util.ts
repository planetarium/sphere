import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex } from "@noble/hashes/utils";

export function toChecksum(address: string) {
  const addressHash = bytesToHex(keccak_256(address));
  return address
    .split("")
    .map((c, i) => (parseInt(addressHash[i], 16) > 7 ? c.toUpperCase() : c))
    .join("");
}
