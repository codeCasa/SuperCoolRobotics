import { Guid } from "guid-typescript";

export interface IUser {
    uuid: string;
    username: string;
    password: string;
}

export const validUsers: IUser[] = [
    {
        uuid: Guid.create().toString(),
        username: "tester1",
        password: "password1234",
    },
    {
        uuid: Guid.create().toString(),
        username: "tester2",
        password: "password1234",
    },
    {
        uuid: Guid.create().toString(),
        username: "tester3",
        password: "password1234",
    },
    {
        uuid: Guid.create().toString(),
        username: "tester4",
        password: "password1234",
    },
];
