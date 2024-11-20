// src/hooks/useSecureStore.ts
import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../utils/constants';
import type { Credentials } from '../types';

export const useSecureStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveCredentials = useCallback(async (credentials: Credentials) => {
    setLoading(true);
    setError(null);
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.CREDENTIALS,
        JSON.stringify({
          ...credentials,
          lastUpdated: new Date().toISOString()
        })
      );
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCredentials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.CREDENTIALS);
      if (!data) return null;

      const credentials = JSON.parse(data);
      // 保存から30日以上経過している場合は無効化
      const lastUpdated = new Date(credentials.lastUpdated);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (lastUpdated < thirtyDaysAgo) {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.CREDENTIALS);
        return null;
      }

      return credentials;
    } catch (e) {
      setError(e as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCredentials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CREDENTIALS);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveCredentials,
    getCredentials,
    clearCredentials,
    loading,
    error
  };
};