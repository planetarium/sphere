import { Account } from "../sign";
import { KEYSTORE_PATH } from "./util";
import fs from "fs";
import { homedir } from "os";
import path from "path";

export class LocalKeyStore(path = KEYSTORE_PATH[process.platform]) {
    
    function listAccounts(path: string): string[]{
        return fs.readdirSync(path).filter(f => f.match(/^UTC--\d{4}-\d\d-\d\dT\d\d-\d\d-\d\dZ--([\da-f]{8}-?(?:[\da-f]{4}-?){3}[\da-f]{12})$/i));
    }
}

