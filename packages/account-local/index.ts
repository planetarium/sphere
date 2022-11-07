import { Account } from "@planetarium/sign";
import { UTC_FILE_PATTERN, sanitizeKeypath } from "./util";
import fs from "fs/promises";
import path from "path";
import Wallet from "ethereumjs-wallet";
import secp from "@noble/secp256k1";

/**
 * account-local
 *
 * Gets Web3 Secret Storage formatted keyfile as key source and creates account.
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 *
 * Default filepath of "listAccounts" is planetarium's usual keystore path,
 * Defined and provided as constant in util.ts
 */

export async function listAccounts(folder?: string): Promise<string[]> {
  const list = (await fs.readdir(await sanitizeKeypath(folder)))
    .map((f) => f.match(UTC_FILE_PATTERN)?.[0])
    .filter((v): v is string => !!v);
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
  if (!/^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(uuid))
    throw new Error("UUID format mismatch");
  if (!(await listAccounts(folder)).find(v => v.match(uuid)))
    throw new Error("No matching UUID filename found in folder")
  
  const privKey: Wallet = await Wallet.fromV3(
    await fs.readFile(
      path.resolve(
        await sanitizeKeypath(folder),
        (await listAccounts(folder)).find((v) => v.match(uuid)) ?? ""
      ),
      "utf8"
    ),
    passphrase
  );

  return {
    VERSION: 0,
    async getPublicKey() {
      return privKey.getPublicKey();
    },
    sign(hash) {
      return secp.sign(hash, privKey.getPrivateKeyString());
    },
  };
}
