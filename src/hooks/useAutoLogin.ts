// src/hooks/useAutoLogin.ts
import { useState, useCallback, useRef } from 'react';
import { WebViewNavigation } from 'react-native-webview';
import { useSecureStore } from './useSecureStore';
import { LOGIN_URL_PATTERN, generateAutoLoginScript } from '../utils/constants';

export const useAutoLogin = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { getCredentials } = useSecureStore();
  const webViewRef = useRef(null);

  const handleNavigationStateChange = useCallback(
    async (navState: WebViewNavigation) => {
      if (
        navState.url.includes(LOGIN_URL_PATTERN) &&
        loginAttempts < 3
      ) {
        const credentials = await getCredentials();
        if (credentials?.isAutoLoginEnabled) {
          setLoginAttempts((prev) => prev + 1);
          return generateAutoLoginScript(
            credentials.username,
            credentials.password
          );
        }
      }
      return '';
    },
    [loginAttempts]
  );

  const resetLoginAttempts = useCallback(() => {
    setLoginAttempts(0);
  }, []);

  return {
    webViewRef,
    handleNavigationStateChange,
    resetLoginAttempts,
    loginAttempts
  };
};
