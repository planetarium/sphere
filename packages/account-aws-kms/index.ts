import type { Account } from "@planetarium/sign";
import {
  KMSClient,
  SignCommand,
  GetPublicKeyCommand,
} from "@aws-sdk/client-kms";
import { Sequence } from "asn1js";

export function createAccount(client: KMSClient, KeyId: string): Account {
  return {
    VERSION: 0,
    async getPublicKey() {
      const { PublicKey: publicKey } = await client.send(
        new GetPublicKeyCommand({
          KeyId,
        })
      );
      if (!publicKey) throw new TypeError("Received publicKey is undefined");
      const parsed = new Sequence({
        valueBeforeDecode: publicKey,
      });
      return parsed.valueBlock.value[1].valueBeforeDecodeView;
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
