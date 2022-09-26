import { expect, test } from "vitest";
import { deriveAddress } from "@planetarium/sign";
import { createAccount } from "..";

test("address matches", async () => {
  const samples: [string, string][] = [
    [
      "618f81d6a60563b30a1c06c64a7f026f8b4c5c39f2749ee7838514be848df4ed",
      "0x0B0cAAFD115A2eE9995C2De321c1E8633F28F9c9",
    ],
    [
      "92f24452a9e468579327fd87863f492fb1175000894b6d9808a0c0169bb34576",
      "0x66109E2f4Bf8625E436c48990a7d06c6e12B4126",
    ],
    [
      "3c3830844f12da367a6db5f85ee5e721ddcc5a69d0a0d0c3cb7a8a4fe7a8b7fd",
      "0x0972497180823b0D39734943CE7e2c1cB19281A7",
    ],
  ];
  for (const [privateKey, address] of samples) {
    expect(await deriveAddress(createAccount(privateKey))).eq(address);
  }
});
