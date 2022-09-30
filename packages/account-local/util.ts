import { homedir } from "os";
import path from "path";

export const UTC_FILE_PATTERN = new RegExp(
  /^UTC--\d{4}-\d\d-\d\dT\d\d-\d\d-\d\dZ--([\da-f]{8}-?(?:[\da-f]{4}-?){3}[\da-f]{12})$/i
);

const WIN_KEYSTORE_PATH = path.join(
  homedir(),
  "AppData",
  "Roaming",
  "planetarium",
  "keystore"
);

const MAC_KEYSTORE_PATH = path.join(
  homedir(),
  "Library",
  "Application Support",
  "planetarium",
  "keystore"
);

const LINUX_KEYSTORE_PATH = path.join(
  homedir(),
  ".config",
  "planetarium",
  "keystore"
);

export const KEYSTORE_PATH: {
  [k in NodeJS.Platform]: string | undefined;
} = {
  aix: undefined,
  android: undefined,
  darwin: MAC_KEYSTORE_PATH,
  freebsd: LINUX_KEYSTORE_PATH,
  linux: LINUX_KEYSTORE_PATH,
  openbsd: LINUX_KEYSTORE_PATH,
  sunos: undefined,
  win32: WIN_KEYSTORE_PATH,
  cygwin: WIN_KEYSTORE_PATH,
  netbsd: LINUX_KEYSTORE_PATH,
  haiku: undefined,
};
