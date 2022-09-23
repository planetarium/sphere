import { fromHexString } from "./util";
import { Sequence, Integer } from "asn1js";
import { encode, decode, BencodexDict } from "bencodex";

export interface Signature {
  r: bigint;
  s: bigint;
}

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
  getAddress(): Promise<string>;
  /**
   * Sign a given bytes. The function must return a valid ECDSA signature.
   *
   * @param data A payload to sign.
   */
  sign(hash: ArrayBuffer): Promise<Signature | ArrayBuffer>;
}

export const ACCOUNT_VERSION = 0;

export async function signTransaction(
  tx: string,
  account: Account
): Promise<string> {
  if (account.VERSION !== ACCOUNT_VERSION)
    throw new Error("The Account interface version doesn't match.");

  const txBinary = fromHexString(tx);
  const decodedTx: BencodexDict = decode(txBinary);

  const hash = await crypto.subtle.digest("SHA-256", txBinary);
  const signature = await account.sign(hash);

  const encodedSignature =
    "r" in signature
      ? new Sequence({
          value: [
            Integer.fromBigInt(signature.r),
            Integer.fromBigInt(signature.s),
          ],
        }).toBER(false)
      : signature;

  decodedTx.set(new Uint8Array([0x53]).buffer, encodedSignature);

  return encode(decodedTx)?.toString("hex");
}
