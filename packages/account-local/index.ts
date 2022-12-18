import { Account } from "@planetarium/sign";
import { sanitizeKeypath, listKeystoreFiles, UTC_FILE_PATTERN } from "./util";
import { decipherV3, V3Keystore, rawPrivateKeyToV3 } from "./v3";
import Wallet from "ethereumjs-wallet";
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

export async function getAccountFromFile(
  uuid: string,
  passphrase: string,
  folder?: string
): Promise<Account> {
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(uuid))
    throw new Error("UUID format mismatch");
  if (!listKeystoreFiles(folder).find((v) => v.match(uuid)))
    throw new Error("No matching UUID filename found in folder");
  const V3Keystore = await fs.readFile(
    path.resolve(
      sanitizeKeypath(folder),
      listKeystoreFiles(folder).find((v) => v.match(uuid)) ?? ""
    ),
    "utf8"
  );
  return getAccountFromV3(V3Keystore, passphrase);
}

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

export {
  decipherV3,
  rawPrivateKeyToV3,
  sanitizeKeypath,
  listKeystoreFiles,
  UTC_FILE_PATTERN,
  V3Keystore,
};
