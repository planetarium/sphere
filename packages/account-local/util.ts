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
    [k in NodeJS.Platform]: string | null;
  } = {
    aix: null,
    android: null,
    darwin: MAC_KEYSTORE_PATH,
    freebsd: null,
    linux: LINUX_KEYSTORE_PATH,
    openbsd: null,
    sunos: null,
    win32: WIN_KEYSTORE_PATH,
    cygwin: WIN_KEYSTORE_PATH,
    netbsd: null,
  };