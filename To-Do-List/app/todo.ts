export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export type Todo = { id: number; text: string; date: Date; priority: Priority };

export function createTodo(id: number, text: string, priority: Priority): Todo {
  return { id, text, date: new Date(), priority };
}

export default {};
