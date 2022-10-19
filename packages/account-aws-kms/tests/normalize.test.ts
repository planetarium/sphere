import { expect, test } from "vitest";
import { Signature } from "@noble/secp256k1";

const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

const signatureHighS = fromHexString("3046022100c69ac97237321e013d5bdecb06637e5a9072f2b243ef2f01b54a1b239ce4efe102210082f006edf0490875f09f604e1f871cfc0978667625e2b0d4f959d4cd0da21b09");
const signatureLowS  = fromHexString("30440220484ECE2B365D2B2C2EAD34B518328BBFEF0F4409349EEEC9CB19837B5795A5F5022040C4F6901FE489F923C49D4104554FD08595EAF864137F87DADDD0E3619B0605");

test("Secp256K1 Scalar High-Low S Detection", async () => {
  expect(Signature.fromDER(signatureHighS).hasHighS()).true;
  expect(Signature.fromDER(signatureLowS).hasHighS()).false;
});

test("Secp256K1 Scalar High-S to Low Conversion", async () => {
  expect(Signature.fromDER(signatureHighS).normalizeS().toDERRawBytes(false)).toMatchInlineSnapshot(`
    Uint8Array [
      48,
      69,
      2,
      33,
      0,
      198,
      154,
      201,
      114,
      55,
      50,
      30,
      1,
      61,
      91,
      222,
      203,
      6,
      99,
      126,
      90,
      144,
      114,
      242,
      178,
      67,
      239,
      47,
      1,
      181,
      74,
      27,
      35,
      156,
      228,
      239,
      225,
      2,
      32,
      125,
      15,
      249,
      18,
      15,
      182,
      247,
      138,
      15,
      96,
      159,
      177,
      224,
      120,
      227,
      2,
      177,
      54,
      118,
      112,
      137,
      101,
      239,
      102,
      198,
      120,
      137,
      191,
      194,
      148,
      38,
      56,
    ]
  `);
  expect(Signature.fromDER(signatureLowS).normalizeS().toDERRawBytes(false)).toEqual(signatureLowS);
})

