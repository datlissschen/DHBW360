import dotenv from 'dotenv';
dotenv.config();
import {downloadAllFiles} from './s3'
import {selectRandomRoom} from "@/random-selector";
import {startExpressApp} from "@/api/express-app";
import {readDownloadedImages} from "@/image-service";

/*downloadAllFiles().then(() => {
    console.log('Download all files');
})*/

readDownloadedImages()

startExpressApp()

selectRandomRoom()