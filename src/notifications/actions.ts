import { Notification } from "./notification";

export enum ActionType {
  Add,
  Remove,
}

export type ActionDiscriminator<T extends ActionType> = {
  type: T;
};

export type AddAction = ActionDiscriminator<ActionType.Add> & {
  notification: Notification;
};

export function add(notification: Notification): AddAction {
  return { type: ActionType.Add, notification };
}

export type RemoveAction = ActionDiscriminator<ActionType.Remove> & {
  id: number;
};

export function remove(id: number): RemoveAction {
  return { type: ActionType.Remove, id };
}

export type Action = AddAction | RemoveAction;
