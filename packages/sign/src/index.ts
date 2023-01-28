import { toChecksum } from "./util.js";
import { encode, decode, BencodexDict } from "bencodex";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { Buffer } from "#buffer";
import * as crypto from "#webcrypto";

/**
 * Account is a implementation to perform cryptographic signing and verifying them.
 *
 * Accounts can be provided from the @planetarium/account-* packages or third-parties
 * using the name `planetarium-account-*`.
 */
export interface Account {
  /**
   * Account interface is versioned to safely make changes to the account interface.
   * The users should make sure if the account is compatible with the sign interface
   * they are using.
   */
  readonly VERSION: number;

  getPublicKey(isCompressed?: boolean): Promise<Uint8Array>;
  /**
   * Sign a given bytes. The function must return a valid ECDSA signature using
   * 'SECP256K1' curve.
   *
   * @param data A payload to sign.
   */
  sign(hash: Uint8Array): Promise<Uint8Array>;
}

export const ACCOUNT_VERSION = 0;

export async function signTransaction(
  tx: string,
  account: Account
): Promise<string> {
  if (account.VERSION !== ACCOUNT_VERSION)
    throw new Error("The Account interface version doesn't match.");

  const txBinary = hexToBytes(tx);
  const decodedTx: BencodexDict = decode(new Buffer(txBinary));
  const txPublicKey = await account.getPublicKey(false);
  const hash = await crypto.subtle.digest("SHA-256", txBinary);
  const signature = await account.sign(new Uint8Array(hash));

  if (
    Array.from(decodedTx.entries()).some(
      ([key]: [Buffer, unknown]) => key[0] === 0x53
    )
  )
    throw new Error("Already signed.");

  if (
    Array.from(decodedTx.entries()).some(
      ([key, value]: [Buffer, unknown]) =>
        key[0] === 0x70 && bytesToHex(value) !== bytesToHex(txPublicKey)
    )
  )
    throw new Error(
      "Public key from unsigned TX mismatches with public key derived from signing private key"
    );

  decodedTx.set(new Uint8Array([0x53]), signature.buffer);

  return encode(decodedTx)?.toString("hex");
}

export async function deriveAddress(account: Account) {
  const publicKey = await account.getPublicKey(false);
  return (
    "0x" + toChecksum(bytesToHex(keccak_256(publicKey.slice(1))).slice(-40))
  );
}

export async function getEncodedPublicKey(account: Account) {
  return bytesToHex(await account.getPublicKey());
}
