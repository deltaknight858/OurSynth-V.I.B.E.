'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import clsx from 'clsx'

interface AuthComponentProps {
  className?: string
  view?: 'sign_in' | 'sign_up' | 'magic_link' | 'forgotten_password'
}

export function AuthComponent({ className, view = 'sign_in' }: AuthComponentProps) {
  const { user } = useAuth()

  if (user) {
    return (
      <div className={clsx('text-center', className)}>
        <p className="mb-4">Welcome back, {user.email}!</p>
        <UserProfile />
      </div>
    )
  }

  return (
    <div className={clsx('w-full max-w-md mx-auto', className)}>
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b',
              },
            },
          },
        }}
        providers={['google', 'github']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
}

function UserProfile() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-gray-600">Email:</p>
        <p className="font-medium">{user.email}</p>
        {user.user_metadata?.full_name && (
          <>
            <p className="text-sm text-gray-600 mt-2">Name:</p>
            <p className="font-medium">{user.user_metadata.full_name}</p>
          </>
        )}
      </div>
      <button
        onClick={signOut}
        className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  )
}
