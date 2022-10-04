import { expect, test, vi } from "vitest";
import { deriveAddress } from "@planetarium/sign";
import { listAccounts, getAccountFrom } from "..";
import { UTC_FILE_PATTERN } from "../util";

test("Succed to list Web3 keys in default keystore folder", async () => {
  const result = await listAccounts();
  for (const filepath of result) {
    expect(filepath).toMatch(UTC_FILE_PATTERN);
  }
});
