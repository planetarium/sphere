import { homedir } from "os";
import path from "path";

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
    freebsd: undefined,
    linux: LINUX_KEYSTORE_PATH,
    openbsd: undefined,
    sunos: undefined,
    win32: WIN_KEYSTORE_PATH,
    cygwin: WIN_KEYSTORE_PATH,
    netbsd: undefined,
    haiku: undefined,
  };