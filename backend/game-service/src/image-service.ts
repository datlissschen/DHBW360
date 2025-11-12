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
    console.log("ensure image file ", fullFilePath);
    try {
        await fs.access(fullFilePath);
        console.log('Datei existiert bereits:', fullFilePath);

    } catch (error) {
        console.log('Datei nicht gefunden, starte Download...');
        try {
            await downloadFile(fileName);
            console.log('Download abgeschlossen:', fullFilePath);
        } catch (downloadError) {
            console.error('Fehler beim Erstellen des Ordners oder beim Download:', downloadError);
            throw downloadError;
        }
    }
}