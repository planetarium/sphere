import { Account } from "@planetarium/sign";
import { decipherV3, V3Keystore, rawPrivateKeyToV3 } from "./v3";
import fs from "fs/promises";
import path from "path";
import * as secp from "@noble/secp256k1";

/**
 * account-local
 *
 * Gets Web3 Secret Storage formatted keyfile as key source and creates account.
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 *
 * Default filepath of "listAccounts" is planetarium's usual keystore path,
 * Defined and provided as constant in util.ts
 */

export async function getAccountFromV3(
  V3Keystore: string,
  passphrase: string
): Promise<Account> {
  return new Promise<Account>((resolve, reject) => {
    try {
      decipherV3(V3Keystore, passphrase);
    } catch (e) {
      console.error(e);
      reject(e);
    }
    resolve({
      VERSION: 0,
      getPublicKey(isCompressed: boolean = true) {
        const publicKey = new Uint8Array(
          decipherV3(V3Keystore, passphrase).getPublicKey()
        );
        if (isCompressed)
          return Promise.resolve(
            secp.utils.concatBytes(
              new Uint8Array([0x03]),
              publicKey.slice(0, 32)
            )
          );
        return Promise.resolve(
          secp.utils.concatBytes(new Uint8Array([0x04]), publicKey)
        );
      },
      sign(hash) {
        return secp.sign(
          hash,
          decipherV3(V3Keystore, passphrase).getPrivateKey()
        );
      },
    });
  });
}

export { decipherV3, rawPrivateKeyToV3, V3Keystore };
