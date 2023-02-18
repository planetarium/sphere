import * as secp from "@noble/secp256k1";
import { Account } from "@planetarium/sign";
import { ethers } from "ethers";
import fs from "fs/promises";
import path from "path";
import {
  getDefaultKeystorePath,
  listKeystoreFiles,
  sanitizeKeypath,
  UTC_FILE_PATTERN,
} from "./util";
import { decipherV3, rawPrivateKeyToV3, V3Keystore } from "./v3";

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

export function getAccountFromV3(
  V3Keystore: string,
  passphrase: string
): Account {
  decipherV3(V3Keystore, passphrase);

  return {
    VERSION: 0,
    async getPublicKey(isCompressed: boolean = true) {
      const wallet = new ethers.Wallet(decipherV3(V3Keystore, passphrase));
      const publicKey = secp.utils.hexToBytes(wallet.publicKey.substring(2));

      return secp.Point.fromHex(publicKey).toRawBytes(isCompressed);
    },
    sign(hash) {
      return secp.sign(
        hash,
        decipherV3(V3Keystore, passphrase).privateKey.substring(2)
      );
    },
  };
}

export {
  decipherV3,
  rawPrivateKeyToV3,
  sanitizeKeypath,
  getDefaultKeystorePath,
  listKeystoreFiles,
  UTC_FILE_PATTERN,
  V3Keystore,
};
