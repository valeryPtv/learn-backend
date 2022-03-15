import {fileURLToPath} from "url";

export const getDirname = () => fileURLToPath(import.meta.url);
