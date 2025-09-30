'use client'

import type { User } from '@/lib/schemas/user.schema'
import React, { createContext, useContext } from 'react'

type InitialUserContextValue = {
  user: User | null | undefined
}

const InitialUserContext = createContext<InitialUserContextValue>({
  user: undefined,
})

export function UserProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return <InitialUserContext.Provider value={{ user }}>{children}</InitialUserContext.Provider>
}

export function useInitialUser() {
  return useContext(InitialUserContext)
}
