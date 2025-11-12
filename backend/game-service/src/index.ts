import dotenv from 'dotenv';
import {startExpressApp} from "@/api/express-app";
import {initDatabase} from "@/database";
import {loadAllRooms} from "@/room-manager";

dotenv.config();

async function startup() {
    await initDatabase()
    await loadAllRooms()
    startExpressApp()
}

startup().then(() => {
    console.info("Startup successful")
})