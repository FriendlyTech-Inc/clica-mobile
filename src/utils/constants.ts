// src/utils/constants.ts
export const CLICA_URL = 'https://clica.jp/spn/';
export const LOGIN_URL_PATTERN = '/spn/home/default.aspx';
export const STORAGE_KEYS = {
  CREDENTIALS: 'clica_credentials'
} as const;

// 自動ログインのJavaScriptコード生成
export const generateAutoLoginScript = (credentials: string, password: string) => `
  (function() {
    const usernameField = document.querySelector('input[name="userid"]');
    const passwordField = document.querySelector('input[name="password"]');
    const loginButton = document.querySelector('input[type="submit"]');
    
    if (usernameField && passwordField && loginButton) {
      usernameField.value = '${credentials}';
      passwordField.value = '${password}';
      loginButton.click();
    }
  })();
`;