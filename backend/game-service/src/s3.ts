import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import * as fs from "node:fs";
import {fileURLToPath} from "url";

let s3: S3Client | null = null;

function getS3() {
    if (!s3) {
        s3 = new S3Client({
            region: process.env.S3_REGION!,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY!,
                secretAccessKey: process.env.S3_SECRET_KEY!,
            },
        });
    }
    return s3;
}

export async function downloadAllFiles() {
    const client = getS3();
    const result = await client.send(
            new ListObjectsV2Command({
                Bucket: process.env.S3_BUCKET_NAME!,
            })
    );

    if (!result.Contents || result.Contents.length === 0) {
        console.log("No files found in S3 Bucket");
        return;
    }

    for (const object of result.Contents) {
        if (!object.Key || object.Key.endsWith("/")) continue;
        await downloadFile(object.Key);
    }
}

export async function downloadFile(key: string) {
    const client = getS3();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const downloadDir = path.resolve(__dirname, '../download');
    fs.mkdirSync(downloadDir, { recursive: true });

    const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
    });

    const { Body } = await client.send(getCommand);

    const localPath = path.join(downloadDir, key);
    console.log("downloaded to path ", localPath);

    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    const fileStream = fs.createWriteStream(localPath);

    Body!.transformToByteArray().then((data) => {
        fileStream.write(data);
    });
}
