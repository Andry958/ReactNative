import { Image } from 'expo-image';
import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createTodo, Todo, Priority } from '../todo';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const addTask = () => {
    if (input.trim()) {
      const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
      setTasks([...tasks, createTodo(nextId, input.trim(), priority)]);
      setInput('');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          To-Do List
        </ThemedText>

        <ThemedView style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Add task..."
            style={styles.input}
          />

          <Pressable style={styles.addButton} onPress={addTask}>
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.priorityRow}>
          <ThemedText style={{ marginRight: 8 }}>Priority:</ThemedText>

          <Pressable
            onPress={() => setPriority(Priority.Low)}
            style={[
              styles.priorityButton,
              priority === Priority.Low
                ? styles.priorityActive
                : styles.priorityInactive,
            ]}>
            <ThemedText style={styles.priorityText}>Low</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setPriority(Priority.Medium)}
            style={[
              styles.priorityButton,
              priority === Priority.Medium
                ? styles.priorityActive
                : styles.priorityInactive,
            ]}>
            <ThemedText style={styles.priorityText}>Medium</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setPriority(Priority.High)}
            style={[
              styles.priorityButton,
              priority === Priority.High
                ? styles.priorityActive
                : styles.priorityInactive,
            ]}>
            <ThemedText style={styles.priorityText}>High</ThemedText>
          </Pressable>
        </ThemedView>

        {/* TASK LIST */}
        <ThemedView style={styles.list}>
          {tasks.map((task) => (
            <ThemedView key={task.id} style={styles.taskCard}>
              <ThemedText style={styles.taskId}>ID: {task.id}</ThemedText>
              <ThemedText style={styles.taskText}>{task.text}</ThemedText>
              <ThemedText style={styles.taskDate}>
                {task.date.toLocaleString()}
              </ThemedText>
              <ThemedText style={styles.taskPriority}>
                Priority: {task.priority}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  container: {
    flex: 1,
    padding: 24,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  addButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },

  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  priorityActive: {
    backgroundColor: '#0a7ea4',
  },

  priorityInactive: {
    backgroundColor: '#d1d5db',
  },

  priorityText: {
    color: 'white',
    fontWeight: 'bold',
  },

  list: {
    gap: 8,
  },

  taskCard: {
    backgroundColor: '#E6F4FE',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A1CEDC',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  taskId: {
    fontSize: 12,
    color: '#0a7ea4',
    marginBottom: 4,
    fontWeight: 'bold',
  },

  taskText: {
    fontSize: 16,
    color: '#11181C',
  },

  taskDate: {
    fontSize: 12,
    color: '#687076',
    marginTop: 4,
  },

  taskPriority: {
    fontSize: 12,
    color: '#0a7ea4',
    marginTop: 2,
    fontWeight: 'bold',
  },
});