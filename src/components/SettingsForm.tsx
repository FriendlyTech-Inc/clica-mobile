// src/components/SettingsForm.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Switch, Button, Text } from 'react-native-paper';
import { useSecureStore } from '../hooks/useSecureStore';
import type { Credentials } from '../types';

export const SettingsForm = () => {
  const { saveCredentials, getCredentials, loading } = useSecureStore();
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
    isAutoLoginEnabled: true,
  });

  useEffect(() => {
    const loadCredentials = async () => {
      const saved = await getCredentials();
      if (saved) {
        setCredentials(saved);
      }
    };
    loadCredentials();
  }, []);

  const handleSave = async () => {
    await saveCredentials(credentials);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="ユーザーID"
        value={credentials.username}
        onChangeText={(text) =>
          setCredentials((prev) => ({ ...prev, username: text }))
        }
        style={styles.input}
      />
      <TextInput
        label="パスワード"
        value={credentials.password}
        onChangeText={(text) =>
          setCredentials((prev) => ({ ...prev, password: text }))
        }
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.switchContainer}>
        <Text>自動ログイン</Text>
        <Switch
          value={credentials.isAutoLoginEnabled}
          onValueChange={(value) =>
            setCredentials((prev) => ({ ...prev, isAutoLoginEnabled: value }))
          }
        />
      </View>
      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.button}
      >
        保存
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});