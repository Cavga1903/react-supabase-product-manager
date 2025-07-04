import { createContext } from 'react'
import type { User, Session, AuthResponse } from '@supabase/supabase-js'

export interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined) 