import { Account } from "../sign";
import { KEYSTORE_PATH, UTC_FILE_PATTERN } from "./util";
import fs from "fs/promises";
import path from "path";
import Wallet from "ethereumjs-wallet";
import secp from "@noble/secp256k1";

/**
 * account-local
 * 
 * gets Web3 Secret Storage formatted keyfile as key source and creates account.
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 * 
 * Default filepath of "listAccounts" is planetarium's usual keystore path,
 * Defined and provided as constant in util.ts
 */

export async function listAccounts(
  folder: string | undefined = KEYSTORE_PATH[process.platform]
): Promise<string[]> {
  if (typeof folder !== "string") throw new Error("Invalid path value");
  if (!fs.stat(folder)) throw new Error("This path does not exist");
  const list = (await fs.readdir(folder))
    .filter((f) => f.match(UTC_FILE_PATTERN))
    .map((file) => {
      return path.resolve(folder, file);
    });
  if (list.length <= 0) {
    throw new Error("No keys found in folder");
  }
  return list;
}

export async function getAccountFrom(
  uuid: string,
  passphrase: string,
  folder?: string
): Promise<Account> {
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(uuid)) {
    throw new Error("UUID format mismatch");
  }

  const privKey: Wallet = await Wallet.fromV3(
    await fs.readFile(
      (await listAccounts(folder)).find((v) => new RegExp(uuid, "i").test(v)) ??
        "",
      "utf8"
    ),
    passphrase
  );

  return {
    VERSION: 0,
    async getPublicKey() {
      return privKey.getPublicKey().buffer;
    },
    sign(hash) {
      return secp
        .sign(new Uint8Array(hash), privKey.getPrivateKeyString())
        .then((array) => array.buffer);
    },
  };
}
