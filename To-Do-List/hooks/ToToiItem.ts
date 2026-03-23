export interface ToDoItem {
  id: number;
  text: string;
  date: Date;
  priority: Priority;
}
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}
export function createToDoItem(id: number, text: string, priority: Priority): ToDoItem {
  return { id, text, date: new Date(), priority };
}