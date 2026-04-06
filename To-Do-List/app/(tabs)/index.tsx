import { Image } from 'expo-image';
import { StyleSheet, TextInput, Pressable, View, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { useDispatch } from 'react-redux';
import { setTasks } from '@/redux/todoSlice';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ToDoItem, Priority } from '@/hooks/ToToiItem';
import { addItem, deleteItem, getItems, toggleItem } from '@/services/db';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const dispatch = useDispatch();

  const [tasks, setLocalTasks] = useState<ToDoItem[]>([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [completedInput, setCompletedInput] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getItems(db);
    setLocalTasks(data);
    dispatch(setTasks(data)); // оновлюємо Redux
  };

  const addTaskHandler = async () => {
    if (!input.trim()) return;
    const newTask = await addItem(db, input.trim(), priority, completedInput);
    setLocalTasks([...tasks, newTask]);
    dispatch(setTasks([...tasks, newTask]));
    setInput('');
    setCompletedInput(false);
    setPriority(Priority.Medium);
  };

  const removeTaskHandler = async (id: number) => {
    await deleteItem(db, id);
    const updated = tasks.filter(t => t.id !== id);
    setLocalTasks(updated);
    dispatch(setTasks(updated));
  };

  const toggleCompletedHandler = async (task: ToDoItem) => {
    await toggleItem(db, task.id, !task.completed);
    const updated = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
    setLocalTasks(updated);
    dispatch(setTasks(updated));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          To-Do List
        </ThemedText>

        {/* INPUT ROW */}
        <ThemedView style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Add task..."
            style={styles.input}
          />
          <Pressable style={styles.addButton} onPress={addTaskHandler}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </Pressable>
        </ThemedView>

        {/* COMPLETED SWITCH */}
        <ThemedView style={styles.completedRow}>
          <ThemedText style={{ fontSize: 16 }}>Completed?</ThemedText>
          <Switch
            value={completedInput}
            onValueChange={setCompletedInput}
            thumbColor={completedInput ? "#0a7ea4" : "#ccc"}
          />
        </ThemedView>

        {/* PRIORITY SELECT */}
        <ThemedView style={styles.priorityRow}>
          {Object.values(Priority).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityButton,
                priority === p && styles.prioritySelected
              ]}
            >
              <ThemedText style={{ color: priority === p ? 'white' : '#0a7ea4' }}>
                {p}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>

        {/* TASK LIST */}
        <ThemedView style={styles.list}>
          {tasks.map((task) => (
            <ThemedView key={task.id} style={styles.taskCard}>
              <Pressable onPress={() => toggleCompletedHandler(task)} style={styles.checkbox}>
                {task.completed ? (
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#0a7ea4" />
                ) : (
                  <IconSymbol name="circle" size={24} color="#ccc" />
                )}
              </Pressable>

              <View style={styles.taskContent}>
                <ThemedText style={styles.taskText}>{task.text}</ThemedText>
                <ThemedText style={styles.taskDate}>{task.date.toLocaleString()}</ThemedText>
                <ThemedText style={styles.taskPriority}>
                  Priority: {task.priority}
                </ThemedText>
                <ThemedText style={styles.taskPriority}>
                  Status: {task.completed ? 'Completed' : 'Pending'}
                </ThemedText>
              </View>

              <Pressable onPress={() => removeTaskHandler(task.id)} style={styles.deleteButton}>
                <ThemedText style={{ color: 'white' }}>Delete</ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: { height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' },
  container: { flex: 1, padding: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, fontSize: 16, backgroundColor: '#fff' },
  addButton: { backgroundColor: '#0a7ea4', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  completedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  priorityButton: { borderWidth: 1, borderColor: '#0a7ea4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  prioritySelected: { backgroundColor: '#0a7ea4' },
  list: { gap: 8 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4FE', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#A1CEDC', marginBottom: 4 },
  checkbox: { marginRight: 12 },
  taskContent: { flex: 1 },
  taskText: { fontSize: 16, color: '#11181C' },
  taskDate: { fontSize: 12, color: '#687076', marginTop: 4 },
  taskPriority: { fontSize: 12, color: '#0a7ea4', marginTop: 2, fontWeight: 'bold' },
  deleteButton: { marginLeft: 8, backgroundColor: 'red', padding: 6, borderRadius: 4, alignItems: 'center' },
});