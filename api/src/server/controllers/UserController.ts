/* eslint-disable @typescript-eslint/ban-types */
import { sign } from "jsonwebtoken";
import { Request, Response, Router } from "express";
import { inject, singleton } from "tsyringe";
import { IUser } from "../../models";
import { IConfig } from "../../utils";
import { IController } from "./IController";

@singleton()
export class UserController extends IController {
    constructor(@inject("Config") private readonly config: IConfig) {
        super();
    }
    public defineRoutes(router: Router): void {
        router.post("/user/login", this.localAuthenticationHandler, this.loginAsync);
    }

    private loginAsync = async (req: Request, res: Response) => {
        const user = req.user;
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const token = await this.generateJwt(user as IUser);
        if (!token) {
            res.sendStatus(401);
            return;
        }
        res.status(200).json(token);
    };

    private generateJwt = (user: IUser) => {
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + 60 * 60 * 1000);
        const signingKey = this.config.passportKey;
        return sign(
            {
                _id: user.uuid,
                username: user.username,
                exp: parseInt(`${expiration.getTime()}`),
            },
            signingKey,
        );
    };
}
