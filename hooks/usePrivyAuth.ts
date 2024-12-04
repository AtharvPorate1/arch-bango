import { usePrivy } from '@privy-io/react-auth';
import { useCallback } from 'react';

export function usePrivyAuth() {
  const {
    login,
    logout,
    authenticated,
    user,
    ready,
    connectWallet,
    sendTransaction,
  } = usePrivy();

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  return {
    login: handleLogin,
    logout: handleLogout,
    authenticated,
    user,
    ready,
    connectWallet,
    sendTransaction,
  };
}