import { expect, test } from "vitest";
import {
  secp256K1ScalarIsHigh,
  secp256K1ScalarNegate,
} from "../normalizeSignature";

const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

test("Secp256K1 Scalar High-Low Detection", async () => {
  const signatureHighS = fromHexString("3046022100c69ac97237321e013d5bdecb06637e5a9072f2b243ef2f01b54a1b239ce4efe102210082f006edf0490875f09f604e1f871cfc0978667625e2b0d4f959d4cd0da21b09");
  const signatureLowS  = fromHexString("30440220484ECE2B365D2B2C2EAD34B518328BBFEF0F4409349EEEC9CB19837B5795A5F5022040C4F6901FE489F923C49D4104554FD08595EAF864137F87DADDD0E3619B0605");

  expect(secp256K1ScalarIsHigh(signatureHighS)).true;
  expect(secp256K1ScalarIsHigh(signatureLowS)).false;
});

