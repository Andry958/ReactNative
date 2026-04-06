import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToDoItem } from '@/hooks/ToToiItem';

interface TodoState {
  items: ToDoItem[];
}

const initialState: TodoState = {
  items: [],
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<ToDoItem[]>) {
      state.items = action.payload;
    },
    addTask(state, action: PayloadAction<ToDoItem>) {
      state.items.push(action.payload);
    },
    removeTask(state, action: PayloadAction<number>) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    toggleTask(state, action: PayloadAction<number>) {
      state.items = state.items.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t);
    },
  },
});

export const { setTasks, addTask, removeTask, toggleTask } = todoSlice.actions;
export default todoSlice.reducer;

// Селектор для кількості невиконаних задач
export const selectUncompletedCount = (state: { todo: TodoState }) =>
  state.todo.items.filter(t => !t.completed).length;
