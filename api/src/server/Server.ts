import express, { Application, Router } from "express";
import { Server as HttpServer } from "http";
import methodOverride from "method-override";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import { Server as HttpsServer } from "https";
import path from "path";
import { inject, singleton } from "tsyringe";
import * as useragent from "express-useragent";
import passport from "passport";
import { setupPassportStrategy } from "../services";
import { IConfig } from "../utils";
import cors from "cors";

@singleton()
export class Server {
    private readonly router: Router;
    private readonly appServer: Application;
    private listener: HttpServer | HttpsServer | null = null;
    private httpListener: HttpServer | null = null;

    constructor(@inject("Config") private readonly config: IConfig) {
        this.appServer = express();
        this.router = express.Router();
        this.setupMiddleWares();
    }

    public start(port: number, callback?: () => void) {
        this.appServer.use("/api/v1.0", this.router);
        this.listener = this.appServer.listen(port, () => {
            console.log("listening on port: " + port);
            if (callback) {
                callback();
            }
        });
    }

    public getRouter = () => this.router;

    public shutdown() {
        this.listener?.close();
        this.httpListener?.close();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    public getListener = (): HttpServer | HttpsServer => this.listener!;

    private setupMiddleWares() {
        this.appServer.use(morgan("dev"));
        this.appServer.use(passport.initialize());
        setupPassportStrategy();
        this.appServer.use(express.json({ limit: "500mb" }));
        this.appServer.use(express.urlencoded({ extended: false }));
        this.appServer.use(helmet());
        this.appServer.use(methodOverride("X-HTTP-Method-Override"));
        this.appServer.use(compression());
        this.appServer.use(useragent.express());
        // this.appServer.use((req, res, next) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, Accept");
        //     next();
        // });
        // this.appServer.options("/*", (req, res, next) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        //     res.sendStatus(200);
        //     next();
        // });

        this.appServer.use(
            cors({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "https://localhost:3000",
                    "https://localhost:3001",
                    "http://127.0.0.1:3000",
                ],
                preflightContinue: true,
                credentials: true,
                // exposedHeaders: ["set-cookie"],
            }),
        );
        this.appServer.options(
            cors({
                origin: [
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "https://localhost:3000",
                    "https://localhost:3001",
                    "http://127.0.0.1:3000",
                ],
                preflightContinue: true,
                credentials: true,
                // exposedHeaders: ["set-cookie"],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any,
        );
        // this.appServer.use((req, res, next) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, Accept");
        //     next();
        // });
        // this.appServer.options("/*", (req, res, next) => {
        //     res.header("Access-Control-Allow-Origin", "*");
        //     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        //     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
        //     res.sendStatus(200);
        //     next();
        // });

        this.appServer.use(express.static(path.join(__dirname, "build")));
    }
}
