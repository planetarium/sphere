import { expect, test, beforeAll, describe } from "vitest";
import { KMSClient } from "@aws-sdk/client-kms";
import { fromIni } from "@aws-sdk/credential-providers";
import { deriveAddress, signTransaction } from "@planetarium/sign";
import { createAccount } from "..";

const KEY_ID =
  import.meta.env.AWS_KMS_KEY_ID || "add1894e-86b8-4ffb-aa76-2186b3adc598";

const kmsClient = new KMSClient({
  credentials: fromIni({ profile: import.meta.env.AWS_PROFILE }),
});

test("create a account from keyId", () => {
  expect(() => createAccount(kmsClient, KEY_ID)).to.not.throw;
});

describe("account interface", () => {
  const account = createAccount(kmsClient, KEY_ID);

  test("deriveAddress", async () =>
    expect(await deriveAddress(account)).toMatchInlineSnapshot(
      '"0xA0208696A8E001fEb28b4EF94B9B0029B9C31c06"'
    ));
  test("signTransaction", async () => {
    expect(await signTransaction(""))
  })
});
