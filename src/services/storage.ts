// src/services/storage.ts
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../utils/constants';
import { Credentials } from '../types';

export const StorageService = {
  saveCredentials: async (credentials: Credentials): Promise<void> => {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.CREDENTIALS,
        JSON.stringify(credentials)
      );
    } catch (error) {
      console.error('Failed to save credentials:', error);
      throw error;
    }
  },

  getCredentials: async (): Promise<Credentials | null> => {
    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.CREDENTIALS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get credentials:', error);
      return null;
    }
  },

  deleteCredentials: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.CREDENTIALS);
    } catch (error) {
      console.error('Failed to delete credentials:', error);
      throw error;
    }
  }
};