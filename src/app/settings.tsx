// src/app/settings.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SettingsForm } from '../components/SettingsForm';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '設定',
        }}
      />
      <SettingsForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
