import dotenv from 'dotenv';
import {startExpressApp} from "@/api/express-app";
import {initDatabase} from "@/database";

dotenv.config();

async function startup() {
    await initDatabase();
    startExpressApp()
}

startup().then(() => {
    console.info("Startup successful")
})

