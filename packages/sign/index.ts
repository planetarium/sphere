import { toChecksum } from "./util";
import { encode, decode, BencodexDict } from "bencodex";
import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { Buffer } from "buffer/";

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

  getPublicKey(): Promise<ArrayBuffer>;
  /**
   * Sign a given bytes. The function must return a valid ECDSA signature.
   *
   * @param data A payload to sign.
   */
  sign(hash: ArrayBuffer): Promise<ArrayBuffer>;
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

  const hash = await crypto.subtle.digest("SHA-256", txBinary);
  const signature = await account.sign(hash);

  decodedTx.set(new Buffer([0x53]), signature);

  return encode(decodedTx)?.toString("hex");
}

export async function deriveAddress(account: Account) {
  const publicKey = await account.getPublicKey();
  return (
    "0x" +
    toChecksum(
      bytesToHex(keccak_256(new Uint8Array(publicKey).slice(1))).slice(-40)
    )
  );
}
