import { container } from "tsyringe";
import { IController } from "./IController";
import { UserController } from "./UserController";

export { IController } from "./IController";
export { UserController } from "./UserController";

export const defineControllers = () => {
    container.register<IController>("Controller", { useClass: UserController });
};
