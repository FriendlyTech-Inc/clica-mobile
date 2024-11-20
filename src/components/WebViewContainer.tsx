// src/components/WebViewContainer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';
import { useSecureStore } from '../hooks/useSecureStore';
import { CLICA_URL } from '../utils/constants';
import type { NavigationState, LoadRequestEvent, WebViewMessage } from '../types';

const MAX_LOGIN_ATTEMPTS = 10;

export const WebViewContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [webViewKey, setWebViewKey] = useState(0);
  const [currentUrl, setCurrentUrl] = useState(CLICA_URL);
  const webViewRef = useRef<WebView>(null);
  const { getCredentials } = useSecureStore();

  const generateAutoLoginScript = async (): Promise<string> => {
    const credentials = await getCredentials();
    if (!credentials?.isAutoLoginEnabled) return '';

    return `
      (function() {
        console.log('Starting auto-login process...');
        const userInput = document.getElementById('ctl00_cplPageContent_txtUserID');
        const passwordInput = document.getElementById('ctl00_cplPageContent_txtPassword');
        
        if (userInput && passwordInput) {
          userInput.value = '${credentials.username}';
          passwordInput.value = '${credentials.password}';
          
          setTimeout(() => {
            const loginButton = document.getElementById('ctl00_cplPageContent_LinkButton1');
            if (loginButton) {
              __doPostBack('ctl00$cplPageContent$LinkButton1', '');
              console.log('Login form submitted');
            }
          }, 1000);
        }

        const logoutButton = document.querySelector('a[href="https://clica.jp/app/logout.aspx"]');
        if (logoutButton) {
          logoutButton.addEventListener('click', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
          });
        }

        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'LOGIN_ERROR',
            message: errorMessage.textContent 
          }));
        }
      })();
    `;
  };

  const handleNavigationStateChange = async (navState: NavigationState): Promise<void> => {
    console.log('Navigation state:', navState.url);

    if (navState.url.includes('logout.aspx')) {
      const credentials = await getCredentials();
      if (credentials) {
        await handleLogout();
      }
      return;
    }

    if (navState.url.includes('default.aspx') && loginAttempts < MAX_LOGIN_ATTEMPTS) {
      const script = await generateAutoLoginScript();
      webViewRef.current?.injectJavaScript(script);
      setLoginAttempts(prev => prev + 1);
    }
  };

  const handleMessage = async (event: WebViewMessageEvent): Promise<void> => {
    try {
      const data: WebViewMessage = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'LOGOUT':
          await handleLogout();
          break;
        case 'LOGIN_ERROR':
          if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            await handleMaxAttemptsReached();
          }
          break;
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setLoginAttempts(0);
    router.replace('/settings');
  };

  const handleMaxAttemptsReached = async (): Promise<void> => {
    setLoginAttempts(0);
    router.replace('/settings');
  };

  const handleShouldStartLoadWithRequest = (request: LoadRequestEvent): boolean => {
    if (request.url.startsWith('http://')) {
      const secureUrl = request.url.replace('http://', 'https://');
      setCurrentUrl(secureUrl);
      setWebViewKey(prev => prev + 1);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        key={webViewKey}
        source={{ uri: currentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        originWhitelist={['https://*']}
        sharedCookiesEnabled={true}
        style={styles.webview}
      />
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});