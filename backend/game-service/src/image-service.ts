import * as fs from 'fs/promises';
import path from "path";
import {downloadFile} from "@/s3";
import {fileURLToPath} from "url";

export async function ensureImageFile(fileName: string) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.resolve(__dirname, '../download', fileName);
    try {
        await fs.access(filePath);
    } catch (error) {
        console.log(`File ${fileName} not found. Start download...`);
        try {
            await downloadFile(fileName);
            console.log('Download completed. File saved at: ', filePath);
        } catch (downloadError) {
            console.error('Error while downloading file:', downloadError);
            throw downloadError;
        }
    }
}