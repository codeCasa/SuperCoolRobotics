import passport from "passport";
import { container } from "tsyringe";
import { IConfig } from "../utils";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as HttpBearerStrategy } from "passport-http-bearer";
import { verify } from "jsonwebtoken";
import { validUsers } from "../models/User";

const setupLocalStrategy = () => {
    const localStrategy = new LocalStrategy((username, password, done) => {
        const user = validUsers.find((u) => u.username === username && password === u.password);
        if (!user) {
            return done(new Error("Invalid credentials"), null);
        }
        done(null, user);
    });
    passport.use(localStrategy);
};

const setupBearerStrategy = () => {
    const config: IConfig = container.resolve("Config");
    const strategy = new HttpBearerStrategy((token, done) => {
        verify(token, config.passportKey, (error, decodedToken) => {
            if (error || !decodedToken) {
                return done(error, null);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = validUsers.find((u) => u.uuid === (decodedToken as any).uuid);
            if (!user) {
                return done(new Error(), null);
            }
            done(null, user);
        });
    });
    passport.use(strategy);
};

export const setupPassportStrategy = (): void => {
    setupLocalStrategy();
    setupBearerStrategy();
};
