import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";

export abstract class IController {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected readonly aadAuthenticationHandler: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected readonly localAuthenticationHandler: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected readonly bearerAuthenticationHandler: any;
    public constructor() {
        this.localAuthenticationHandler = passport.authenticate("local", { session: false });
        this.bearerAuthenticationHandler = (req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated()) {
                return next();
            }
            passport.authenticate("bearer", { session: false }, (error, user) => {
                if (!user) {
                    return res.sendStatus(401);
                }
                req.user = user;
                return next();
            })(req, res, next);
        };
    }
    public abstract defineRoutes(router: Router): void;
}
