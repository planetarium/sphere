import { Account } from "../sign";
import { KEYSTORE_PATH } from "./util";
import fs from "fs";
import path from "path";

export function listAccounts(
  folder: string | undefined = KEYSTORE_PATH[process.platform]
): string[] {
  if (typeof folder === "string" && !fs.existsSync(folder)) {
    throw new Error("This path does not exists.");
  } else if (typeof folder !== "string") {
    throw new Error("Invalid path value.");
  }
  const list = fs
    .readdirSync(folder)
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

export function createAccount(folder?: string): Account {
  return {
    VERSION: 0,
  };
}
