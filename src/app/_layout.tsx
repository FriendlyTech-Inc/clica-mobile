// src/app/_layout.tsx
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </PaperProvider>
  );
}