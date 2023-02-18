import * as secp from "@noble/secp256k1";
import { Account } from "@planetarium/sign";
import { ethers } from "ethers";
import { decipherV3, rawPrivateKeyToV3, V3Keystore } from "./v3";

/**
 * account-web
 *
 * Gets Web3 Secret Storage formatted keyfile as key source and creates account.
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 *
 */

export function getAccountFromV3(
  V3Keystore: string,
  passphrase: string
): Account {
  decipherV3(V3Keystore, passphrase);

  return {
    VERSION: 0,
    async getPublicKey(isCompressed: boolean = true) {
      const wallet = new ethers.Wallet(decipherV3(V3Keystore, passphrase));
      const publicKey = secp.utils.hexToBytes(wallet.publicKey.substring(2));

      return secp.Point.fromHex(publicKey).toRawBytes(isCompressed);
    },
    sign(hash) {
      return secp.sign(
        hash,
        decipherV3(V3Keystore, passphrase).privateKey.substring(2)
      );
    },
  };
}

export { decipherV3, rawPrivateKeyToV3, V3Keystore };
