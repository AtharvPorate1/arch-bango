'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from './ui/button';

export default function LoginButton() {
  const { login, authenticated, user } = usePrivy();

  if (authenticated) {
    console.log("Authenticated : ", user)
  }

  return (
      <Button
      onClick={login}
                  variant="ghost"
                  className="hidden md:inline-flex text-white border-white hover:bg-[#ff6600] hover:text-black transition-colors"
                >
                  [ Connect Wallet ]
                </Button>
              
  );
}
