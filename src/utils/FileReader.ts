import fs from "fs";

export interface IFileReader {
    read(path: string): string;
}

export class FileReader implements IFileReader {
    read(path: string): string {
        return fs.readFileSync(path).toString("utf8");
    }
}