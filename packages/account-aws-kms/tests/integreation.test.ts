import { expect, test, beforeAll, describe } from "vitest";
import { KMSClient } from "@aws-sdk/client-kms";
import { fromIni } from "@aws-sdk/credential-providers";
import { deriveAddress, signTransaction } from "@planetarium/sign";
import { createAccount } from "..";

if (globalThis.crypto == null) {
  // FIXME: This is a workaround for the lack of Web Crypto API in Vitest.
  // @ts-ignore
  globalThis.crypto = require("node:crypto");
}

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

  describe("details", () => {
    test("publicKey", async () => expect(await account.getPublicKey()).toMatchInlineSnapshot(`
      Uint8Array [
        4,
        170,
        23,
        202,
        117,
        194,
        99,
        225,
        118,
        0,
        62,
        20,
        240,
        251,
        142,
        112,
        145,
        223,
        182,
        252,
        115,
        205,
        91,
        215,
        188,
        12,
        12,
        228,
        2,
        42,
        107,
        33,
        164,
        236,
        27,
        123,
        246,
        228,
        10,
        33,
        13,
        209,
        226,
        208,
        93,
        124,
        134,
        252,
        31,
        238,
        62,
        169,
        149,
        179,
        171,
        99,
        86,
        25,
        225,
        129,
        112,
        171,
        7,
        97,
        213,
      ]
    `))
  })

  test("deriveAddress", async () =>
    expect(await deriveAddress(account)).toMatchInlineSnapshot(
      '"0xA0208696A8E001fEb28b4EF94B9B0029B9C31c06"'
    ));
  test("signTransaction", async () => {
    expect(
      await signTransaction(
        "64313a616c6475373a747970655f696475363a7374616b653275363a76616c7565736475323a616d69316575323a696431363a64a268c8248da04b954c9141395e52f8656565313a6733323a4582250d0da33b06779a8475d283d5dd210c683b9b999d74d03fac4f58fa6bce313a6e693065313a7036353a04aa17ca75c263e176003e14f0fb8e7091dfb6fc73cd5bd7bc0c0ce4022a6b21a4ec1b7bf6e40a210dd1e2d05d7c86fc1fee3ea995b3ab635619e18170ab0761d5313a7332303aa0208696a8e001feb28b4ef94b9b0029b9c31c06313a747532373a323032322d31302d30355430353a33383a31342e3630363836365a313a756c32303a037afa4bec223b5f6f2f41f6a475f2d1dff1ad7332303aa0208696a8e001feb28b4ef94b9b0029b9c31c066565",
        account
      )
    ).toMatchSnapshot();
  });
});
