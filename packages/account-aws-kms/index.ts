import type { Account } from "@planetarium/sign";
import {
  KMSClient,
  SignCommand,
  GetPublicKeyCommand,
  GetPublicKeyCommandOutput,
} from "@aws-sdk/client-kms";
import { parseSubjectPublicKeyInfo } from "./parseAsn1";

export function createAccount(client: KMSClient, KeyId: string): Account {
  let publicKeyPromise: Promise<GetPublicKeyCommandOutput> | null = null;

  return {
    VERSION: 0,
    async getPublicKey(isCompressed) {
      if (!publicKeyPromise)
        publicKeyPromise = client.send(
          new GetPublicKeyCommand({
            KeyId,
          })
        );

      const { PublicKey } = await publicKeyPromise;
      if (!PublicKey) throw new TypeError("Received publicKey is undefined");

      let publicKey = parseSubjectPublicKeyInfo(PublicKey);
      // https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm
      if (isCompressed) publicKey = publicKey.slice(0, 34).fill(0x03, 1, 2);
      return publicKey;
    },
    async sign(hash) {
      const { Signature: signature } = await client.send(
        new SignCommand({
          KeyId,
          Message: new Uint8Array(hash),
          MessageType: "DIGEST",
          SigningAlgorithm: "ECDSA_SHA_256",
        })
      );
      if (!signature) throw new TypeError("Received signature is undefined");
      return signature.buffer;
    },
  };
}
