import { FastifyInstance } from "fastify";
import createServer from "./utils/createServer";
import { connectToDb, disconnectFromDb } from "./utils/db";
import logger from "./utils/logger";

function gracefulShutdown(signal: string, app: FastifyInstance) {
    process.on(signal, async () => {
        logger.info(`Got signal ${signal}`);
        app.close()
        await disconnectFromDb();
        logger.info("my work here is done");
        process.exit(0);
    })
}

async function main() {
    const app = createServer();
    try {
        const url = await app.listen(4000, "0.0.0.0");
        logger.info(`Server is up at ${url}`);
        await connectToDb();
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
    const signals = ["SIGTERM","SIGNT"]
    for(let i=0;i<signals.length,i++;){
        gracefulShutdown(signals[i],app);
    }
}


main();