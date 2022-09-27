import { Account } from "../sign";
import { KEYSTORE_PATH } from "./util";
import Wallet from "ethereumjs-wallet";
import secp from "@noble/secp256k1";
import fs from "fs/promises";
import path from "path";

export async function listAccounts(
  folder: string | undefined = KEYSTORE_PATH[process.platform]
): Promise<string[]> {
  if (typeof folder === "string" && !fs.stat(folder)) {
    throw new Error("This path does not exists");
  } else if (typeof folder !== "string") {
    throw new Error("Invalid path value");
  }
  const list = (await fs.readdir(folder))
    .filter((f) =>
      f.match(
        /^UTC--\d{4}-\d\d-\d\dT\d\d-\d\d-\d\dZ--([\da-f]{8}-?(?:[\da-f]{4}-?){3}[\da-f]{12})$/i
      )
    )
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
    fs
      .readFile(
        (await listAccounts(folder)).filter((v) =>
          v.toLowerCase().includes(uuid?.toLowerCase())
        )[0]
      )
      .toString(),
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
