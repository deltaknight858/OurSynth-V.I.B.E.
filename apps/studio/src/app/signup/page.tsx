'use client'

import React, { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import Link from 'next/link'

// Styled Components
const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--background-primary);
`

const SignupCard = styled.div`
  background: var(--glass-background);
  backdrop-filter: var(--glass-backdrop-filter);
  border: var(--glass-border);
  border-radius: var(--glass-border-radius);
  padding: var(--spacing-xxl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--glass-box-shadow);
`

const Title = styled.h1`
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-sm);
`

const Subtitle = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: 1rem;
`

const AuthWrapper = styled.div`
  .supabase-auth-ui_ui {
    /* Override Supabase Auth UI styles to match our theme */
    --default-font-family: inherit;
    --default-font-size: 14px;
    --default-line-height: 1.5;
    --default-border-radius: var(--glass-border-radius);
    --default-space: var(--spacing-md);
    --default-border-color: rgba(255, 255, 255, 0.1);
    --default-border-width: 1px;
    --default-input-background: var(--glass-background-dark);
    --default-input-border-color: rgba(255, 255, 255, 0.1);
    --default-input-border-focus-color: var(--accent-color);
    --default-input-text-color: var(--text-primary);
    --default-input-placeholder-color: var(--text-muted);
    --default-button-background: var(--accent-color);
    --default-button-background-hover: var(--accent-color);
    --default-button-border-color: var(--accent-color);
    --default-button-text-color: white;
    --default-anchor-text-color: var(--accent-color);
  }

  .supabase-auth-ui_ui input {
    background: var(--glass-background-dark) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: var(--glass-border-radius) !important;
    color: var(--text-primary) !important;
    padding: var(--spacing-md) !important;
    transition: var(--transition-normal) !important;
  }

  .supabase-auth-ui_ui input:focus {
    border-color: var(--accent-color) !important;
    box-shadow: 0 0 0 2px rgba(160, 32, 240, 0.2) !important;
    outline: none !important;
  }

  .supabase-auth-ui_ui button {
    background: var(--primary-gradient) !important;
    border: none !important;
    border-radius: var(--glass-border-radius) !important;
    color: white !important;
    font-weight: 600 !important;
    padding: var(--spacing-md) var(--spacing-lg) !important;
    transition: var(--transition-normal) !important;
    cursor: pointer !important;
  }

  .supabase-auth-ui_ui button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 16px rgba(160, 32, 240, 0.4) !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-link {
    color: var(--accent-color) !important;
    text-decoration: none !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-link:hover {
    text-decoration: underline !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-label {
    color: var(--text-primary) !important;
    font-weight: 500 !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-message {
    color: var(--text-secondary) !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-message--error {
    color: #ef4444 !important;
  }

  .supabase-auth-ui_ui .supabase-auth-ui_ui-divider {
    background: rgba(255, 255, 255, 0.1) !important;
  }
`

const LoginLink = styled.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const LoginText = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
`

const LoginButton = styled(Link)`
  display: inline-block;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-normal);
  
  &:hover {
    text-decoration: underline;
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  color: var(--text-secondary);
  padding: var(--spacing-xl);
`

const Features = styled.div`
  margin-bottom: var(--spacing-xl);
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  
  &::before {
    content: '✓';
    color: var(--accent-color);
    font-weight: bold;
    margin-right: var(--spacing-sm);
  }
`

export default function SignupPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for user session on mount
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          router.push('/studio')
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Redirect to studio after successful signup
          router.push('/studio')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  // Show loading while checking auth state
  if (loading) {
    return (
      <SignupContainer>
        <SignupCard>
          <LoadingMessage>
            Loading...
          </LoadingMessage>
        </SignupCard>
      </SignupContainer>
    )
  }

  // Show loading if user is already authenticated
  if (user) {
    return (
      <SignupContainer>
        <SignupCard>
          <LoadingMessage>
            Redirecting to studio...
          </LoadingMessage>
        </SignupCard>
      </SignupContainer>
    )
  }

  return (
    <SignupContainer>
      <SignupCard>
        <Title>Join OurSynth</Title>
        <Subtitle>
          Create your account and start making music today
        </Subtitle>

        <Features>
          <FeatureList>
            <FeatureItem>Access to professional synthesizers</FeatureItem>
            <FeatureItem>Browse and use premium templates</FeatureItem>
            <FeatureItem>Save and share your projects</FeatureItem>
            <FeatureItem>Join the music creation community</FeatureItem>
          </FeatureList>
        </Features>
        
        <AuthWrapper>
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#A020F0',
                    brandAccent: '#8B1A9B',
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputBorder: 'rgba(255, 255, 255, 0.1)',
                    inputBorderFocus: '#A020F0',
                    inputText: '#ffffff',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              },
              className: {
                container: 'supabase-auth-ui_ui',
                button: 'supabase-auth-ui_ui-button',
                input: 'supabase-auth-ui_ui-input',
                label: 'supabase-auth-ui_ui-label',
                message: 'supabase-auth-ui_ui-message',
                divider: 'supabase-auth-ui_ui-divider',
              },
            }}
            providers={['google', 'github']}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            onlyThirdPartyProviders={false}
            magicLink={false}
            showLinks={false}
          />
        </AuthWrapper>

        <LoginLink>
          <LoginText>Already have an account?</LoginText>
          <LoginButton href="/login">
            Sign in here
          </LoginButton>
        </LoginLink>
      </SignupCard>
    </SignupContainer>
  )
}
