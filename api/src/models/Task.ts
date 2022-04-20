export enum TaskType {
    Walk,
    PickUp,
    DropOff,
    Sleep,
    WakeUp,
}

export const TaskDescriptions = {
    [TaskType.Walk]: "The robot will walk forward",
    [TaskType.PickUp]: "The robot will pick up the item in front of it",
    [TaskType.DropOff]: "The robot will drop the item in front of itself",
    [TaskType.Sleep]: "The robot will go to sleep",
    [TaskType.WakeUp]: "The robot will wake up",
};

export enum TaskStatus {
    Active,
    Queued,
    Failed,
}

export interface Task {
    uuid: string;
    type: TaskType;
    status: TaskStatus;
    assignedBy: string;
    taskLength: number;
}
