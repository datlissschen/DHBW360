import * as fs from 'fs/promises';
import path from "path";
import {downloadFile} from "@/s3";

/*export const available_rooms: string[] = []
export function readDownloadedImages() {
    fs.readdirSync('download/rooms').forEach(file => {
        available_rooms.push(file)
    })
}*/

export async function ensureImageFile(fileName: string) {
    const fullFilePath = path.resolve('download', fileName);
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