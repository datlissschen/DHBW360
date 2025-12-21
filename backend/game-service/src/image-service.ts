import * as fs from 'fs/promises';
import path from "path";
import {downloadFile} from "@/s3";

export async function ensureImageFile(fileName: string) {
    const fullFilePath = path.resolve('./game-service/download', fileName);
    try {
        await fs.access(fullFilePath);
    } catch (error) {
        console.log(`File ${fileName} not found. Start download...`);
        try {
            await downloadFile(fileName);
            console.log('Download completed. File saved at: ', fullFilePath);
        } catch (downloadError) {
            console.error('Error while downloading file:', downloadError);
            throw downloadError;
        }
    }
}