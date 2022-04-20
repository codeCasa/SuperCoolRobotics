import { singleton } from "tsyringe";
import { Server, Socket } from "socket.io";
import { SocketIOServer } from "../server/SocketIOServer";
import { Robot } from "../models";

export enum SocketMessages {
    Connection = "connection",
    Connected = "connected",
}

@singleton()
export class SocketIORobotService {
    private readonly sockIOServer: Server;
    private readonly robots: Robot[] = [];

    constructor(server: SocketIOServer) {
        this.sockIOServer = server.getSocketServer();
        this.createRobots();
    }

    public listenForDefaultConnections = (): void => {
        this.sockIOServer.on(SocketMessages.Connection, (socket: Socket) => {
            socket.emit(SocketMessages.Connected, {
                id: socket.id,
            });
            // socket.on(SocketMessages.CheckIfRoomExists, (trackId: string) => {
            //     const doesRoomExist = this.rooms.indexOf(trackId) >= 0;
            //     if (doesRoomExist) {
            //         socket.emit(SocketMessages.CheckedIfRoomExists, {
            //             doesRoomExist,
            //             asker: socket.id,
            //         });
            //         return;
            //     }
            //     this.createNewRoom(trackId, socket);
            // });
        });
    };

    private createRobots = () => {
        for (let i = 0; i < 4; i++) {
            this.robots.push(new Robot(`${i}`));
        }
    };
}
