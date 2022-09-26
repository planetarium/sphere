import { keccak_256 } from "@noble/hashes/sha3";

export const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export function toChecksum(address: string) {
  const addressHash = toHexString(keccak_256(address));
  return address
    .split("")
    .map((c, i) => (parseInt(addressHash[i], 16) > 7 ? c.toUpperCase() : c))
    .join("");
}
