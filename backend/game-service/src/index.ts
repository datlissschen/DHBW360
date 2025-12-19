import dotenv from 'dotenv';
import {startExpressApp} from "@/api/express-app";
import {loadAllRooms} from "@/room-manager";
import {downloadAllFiles} from "@/s3";

dotenv.config();

async function startup() {
    await downloadAllFiles()
    await loadAllRooms()
    startExpressApp()
}

startup().then(() => {
    console.info("Startup successful")
})

