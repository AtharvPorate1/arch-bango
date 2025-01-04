'use client'

import React, { useState, useEffect, useCallback } from 'react'
import AuthModal from './AuthModal'
// import { useAtom } from 'jotai'

function ConnectButton(): JSX.Element {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "connect wallet")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem('username'))


  const checkUsernameAndAuth = useCallback(() => {
    const storedUsername = localStorage.getItem('username')
    // const accessToken = localStorage.getItem('accessToken')

    if (storedUsername) {
      setUsername(storedUsername)
      setAuthenticated(true)
    } else {
      setUsername("connect wallet")
      setAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    checkUsernameAndAuth()

    // Set up an interval to check for changes
    const intervalId = setInterval(checkUsernameAndAuth, 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [checkUsernameAndAuth])


  const handleAppkit = useCallback(() => {
    setIsAuthModalOpen(true)
  }, [])

  return (
    <div>
<div
  onClick={handleAppkit}
  className="flex hover:cursor-pointer text-xs sm:text-lg self-center dm-sans md:font-bold text-black md:py-2 md:px-4 font-medium py-1 px-2 rounded-sm md:rounded-md bg-o1"
  style={{
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }}
>
  [ {username} ]
</div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialUsername={username}
      />
    </div>
  )
}

export default ConnectButton

