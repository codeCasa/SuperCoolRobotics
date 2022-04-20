import { Server } from "socket.io";
import { Server as HttpsServer } from "https";
import { Server as HttpServer } from "http";
import { Server as AppServer } from "./Server";
import { delay, inject, singleton } from "tsyringe";
import { IConfig } from "../utils";

@singleton()
export class SocketIOServer {
    private ioSocket: Server | null = null;
    private readonly server: HttpServer | HttpsServer;
    private readonly config: IConfig;

    constructor(@inject(delay(() => AppServer)) server: AppServer, @inject("Config") config: IConfig) {
        this.server = server.getListener();
        this.config = config;
    }
    public initializeAsync = async (): Promise<void> => {
        this.ioSocket = new Server(this.server, {
            cors: {
                origin: this.config.clientEndpoint,
                methods: ["GET", "POST"],
            },
            transports: ["polling"],
            // path: config.MusicP2PEndpoint,
        });
        this.ioSocket.listen(this.server);
    };

    public getSocketServer = (): Server => {
        if (!this.ioSocket) {
            throw new Error("Must initialize server");
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.ioSocket!;
    };
}
