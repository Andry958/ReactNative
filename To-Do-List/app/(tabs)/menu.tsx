import { Image, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function Menu() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          Welcome to the Menu!
        </ThemedText>

        <ThemedText style={styles.text}>
          This is your personal menu screen. Here you can see an overview of your app,
          check out your settings, or simply enjoy this welcome message.
        </ThemedText>

        <ThemedText style={styles.text}>
          Have a great day using your To-Do List app! 🌟
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
  },
});