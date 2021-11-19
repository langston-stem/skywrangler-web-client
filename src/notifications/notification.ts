export type Level = "info" | "warn" | "error";

export type Notification = Readonly<{
  id: number;
  level: Level;
  message: string;
  autohide?: boolean;
}>;

let currentId = 0;

export function nextId(): number {
  return currentId++;
}
