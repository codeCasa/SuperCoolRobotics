import { Guid } from "guid-typescript";
import { random } from "lodash";
import { Task } from "./Task";

export class Robot {
    public readonly uuid: string;
    private isExecutingTask = false;
    private completedTasks: string[] = [];
    private failedTasks: string[] = [];

    public constructor(public readonly name: string) {
        this.uuid = Guid.create().toString();
    }

    public canExecute = () => !this.isExecutingTask;

    public execute = (task: Task) => {
        if (!this.canExecute()) {
            return Promise.reject();
        }
        const failJob = parseInt("" + random()) % 2 === 0;
        return new Promise((resolve, reject) => {
            setTimeout(failJob ? reject : resolve, task.taskLength);
        });
    };

    public getSuccessRatio = () => {
        if (this.completedTasks.length === 0 && this.failedTasks.length) {
            return 0;
        }
        return this.completedTasks.length / (this.completedTasks.length + this.failedTasks.length);
    };
}
