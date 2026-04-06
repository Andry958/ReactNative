export interface ToDoItem {
  id: number;
  text: string;
  date: Date;
  priority: Priority;
  completed?: boolean | null | undefined;
}
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
export function createToDoItem(id: number, text: string, priority: Priority, completed: boolean): ToDoItem {
  return { id, text, date: new Date(), priority, completed };
}