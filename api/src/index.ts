import "reflect-metadata";
import { defineControllers, Server, SocketIOServer } from "./server";
import { forEach } from "lodash";
import { container } from "tsyringe";
import { IController } from "./server/controllers/IController";
import { IConfig } from "./utils";
import { SocketIORobotService } from "./services";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: IConfig = require("./env.json");
container.register<IConfig>("Config", { useValue: config });
const server = container.resolve(Server);
console.log("defining routes");
defineControllers();
const router = server.getRouter();
forEach(container.resolveAll<IController>("Controller"), (controller) => {
    controller.defineRoutes(router);
});
server.start(config.port, () => {
    const socketIoServer = container.resolve(SocketIOServer);
    socketIoServer
        .initializeAsync()
        .then(() => {
            container.resolve(SocketIORobotService).listenForDefaultConnections();
        })
        .catch((e) => {
            console.error("failed to init socket io", e);
        });
});
console.log("server started.");
//for nodemon restarts
process.once("SIGUSR2", function () {
    server.shutdown();
    process.kill(process.pid, "SIGUSR2");
});

//for app termination
process.once("SIGINT", function () {
    process.exit(0);
});
