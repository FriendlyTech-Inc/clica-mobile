// src/types/index.ts
import { WebViewNavigation, WebViewMessageEvent } from 'react-native-webview';

export interface Credentials {
  username: string;
  password: string;
  isAutoLoginEnabled: boolean;
  lastUpdated?: string;
}

export interface WebViewMessage {
  type: 'LOGIN_SUCCESS' | 'LOGIN_ERROR' | 'LOGOUT';
  message?: string;
}

export type NavigationState = WebViewNavigation & {
  url: string;
};

export interface LoadRequestEvent {
  url: string;
  navigationType: 'click' | 'formsubmit' | 'backforward' | 'reload' | 'formresubmit' | 'other';
  mainDocumentURL?: string;
}