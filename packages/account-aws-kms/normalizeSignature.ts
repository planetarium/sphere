const SECP256K1_N_H_0: bigint = BigInt.asUintN(
  64,
  BigInt("0xDFE92F46681B20A0")
);
const SECP256K1_N_H_1: bigint = BigInt.asUintN(
  64,
  BigInt("0x5D576E7357A4501D")
);
const SECP256K1_N_H_2: bigint = BigInt.asUintN(
  64,
  BigInt("0xFFFFFFFFFFFFFFFF")
);
const SECP256K1_N_H_3: bigint = BigInt.asUintN(
  64,
  BigInt("0x7FFFFFFFFFFFFFFF")
);

export function secp256K1ScalarIsHigh(a: Uint8Array) {
  let c = a.buffer;
  let b = new BigUint64Array(c, a.byteOffset, 4);
  let isHigh = new Int32Array([0, 0]);
  isHigh[1] |= b[3] < SECP256K1_N_H_3 ? 1 : 0;
  isHigh[0] |= (b[3] > SECP256K1_N_H_3 ? 1 : 0) & ~isHigh[1];
  isHigh[1] |= (b[2] < SECP256K1_N_H_2 ? 1 : 0) & ~isHigh[0];
  isHigh[1] |= (b[1] < SECP256K1_N_H_1 ? 1 : 0) & ~isHigh[0];
  isHigh[0] |= (b[1] > SECP256K1_N_H_1 ? 1 : 0) & ~isHigh[1];
  isHigh[0] |= (b[0] > SECP256K1_N_H_0 ? 1 : 0) & ~isHigh[1];

  return isHigh[0];
}

export function secp256K1ScalarNegate(a: Uint8Array) {
    let c = a.buffer;
    let b = new BigUint64Array(c, a.byteOffset, 4);
    console.log(b[0], b[1], b[2], b[3]);
  let nonzero: bigint = BigInt.asUintN(
    64,
    BigInt(0xffffffffffffffff) * BigInt(secp256K1ScalarIsZero(b) == false)
  );
  let t: bigint = BigInt.asUintN(128, ~b[0]) + SECP256K1_N_H_0 + 1n;
  b[0] = t & nonzero;
  t >>= 64n;
  t += BigInt.asUintN(128, ~b[1]) + SECP256K1_N_H_1;
  b[1] = t & nonzero;
  t >>= 64n;
  t += BigInt.asUintN(128, ~b[2]) + SECP256K1_N_H_2;
  b[2] = t & nonzero;
  t >>= 64n;
  t += BigInt.asUintN(128, ~b[3]) + SECP256K1_N_H_3;
  b[3] = t & nonzero;
  return new Uint8Array(b);
}

function secp256K1ScalarIsZero(b: BigUint64Array) {
  return (b[0] | b[1] | b[2] | b[3]) == 0n;
}
