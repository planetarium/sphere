import ethers from "ethers";

// https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
export interface V3Keystore {
  crypto: {
    cipher: string;
    cipherparams: {
      iv: string;
    };
    ciphertext: string;
    kdf: string;
    kdfparams: KDFParamsOut;
    mac: string;
  };
  id: string;
  version: number;
  address: string;
}

interface PBKDFParamsOut {
  c: number;
  dklen: number;
  prf: string;
  salt: string;
}

interface ScryptKDFParamsOut {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: string;
}

type KDFParamsOut = ScryptKDFParamsOut | PBKDFParamsOut;

export function decipherV3(
  input: string | V3Keystore,
  password: string,
  nonStrict = false
) {
  const json = typeof input === "object"
    ? JSON.stringify(input)
    : (nonStrict ? input.toLowerCase() : input);
  const decrypted = ethers.decryptKeystoreJsonSync(json, password);
  return decrypted;
}

export async function rawPrivateKeyToV3(
  privateKey: string,
  passphrase: string
) {
  try {
    const signingKey = new ethers.SigningKey(Buffer.from(privateKey, "hex"));
    const encryptedJson = await ethers.encryptKeystoreJson({
      address: ethers.computeAddress(signingKey),
      privateKey: signingKey.privateKey,
    }, passphrase);

    return encryptedJson;
  } catch (e) {
    console.error(e);
  }
}
