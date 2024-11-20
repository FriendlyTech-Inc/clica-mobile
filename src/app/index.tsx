// src/app/index.tsx
import React from 'react';
import { Stack, Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { WebViewContainer } from '../components/WebViewContainer';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Clica',
          headerRight: () => (
            <Link href="/settings" asChild>
              <IconButton icon="cog" />
            </Link>
          ),
        }}
      />
      <WebViewContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});