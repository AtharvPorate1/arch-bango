'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

interface PrivyProviderProps {
  children: React.ReactNode;
}

export default function PrivyClientProvider({ children }: PrivyProviderProps) {
  const router = useRouter();

  return (
    <PrivyProvider
    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
      onSuccess={() => {
        router.push('/discover');
      }}
    >
      {children}
    </PrivyProvider>
  );
}