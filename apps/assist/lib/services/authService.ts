// Enhanced Auth Service for OurSynth-Eco noteflow
// Integrates with the existing auth pattern and provides user context

import { User, ServiceResponse, UserId } from '../types/core';
import { userService } from './userService';

interface AuthSession {
  userId: UserId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

class AuthService {
  private currentSession: AuthSession | null = null;
  private sessions: Map<string, AuthSession> = new Map();

  // Sign up a new user
  async signUp(signUpData: SignUpData): Promise<ServiceResponse<{ user: User; session: AuthSession }>> {
    try {
      // Check if user already exists
      const existingUserResult = await userService.getByEmail(signUpData.email);
      if (existingUserResult.success) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Create new user
      const userResult = await userService.create({
        email: signUpData.email,
        name: signUpData.name,
        preferences: {
          theme: 'light',
          defaultView: 'notes'
        }
      });

      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: userResult.error || 'Failed to create user'
        };
      }

      // Create session
      const session = this.createSession(userResult.data.id);
      this.currentSession = session;

      return {
        success: true,
        data: { user: userResult.data, session },
        message: 'User signed up successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign up user'
      };
    }
  }

  // Sign in existing user
  async signIn(credentials: SignInCredentials): Promise<ServiceResponse<{ user: User; session: AuthSession }>> {
    try {
      // Find user by email
      const userResult = await userService.getByEmail(credentials.email);
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // In a real implementation, you would validate the password here
      // For now, we'll assume it's valid since this is a demo service
      
      // Create session
      const session = this.createSession(userResult.data.id);
      this.currentSession = session;

      // Update last active
      await userService.updateLastActive(userResult.data.id);

      return {
        success: true,
        data: { user: userResult.data, session },
        message: 'User signed in successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in user'
      };
    }
  }

  // Sign in with Google (placeholder for OAuth integration)
  async signInWithGoogle(): Promise<ServiceResponse<{ user: User; session: AuthSession }>> {
    try {
      // This would integrate with OAuth provider
      // For demo purposes, we'll create a test user
      const testUser = await userService.create({
        email: 'user@example.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/40',
        preferences: {
          theme: 'light',
          defaultView: 'notes'
        }
      });

      if (!testUser.success || !testUser.data) {
        return {
          success: false,
          error: 'Failed to create Google user'
        };
      }

      const session = this.createSession(testUser.data.id);
      this.currentSession = session;

      return {
        success: true,
        data: { user: testUser.data, session },
        message: 'Signed in with Google successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in with Google'
      };
    }
  }

  // Sign in with magic link (placeholder)
  async signInWithMagicLink(email: string): Promise<ServiceResponse<boolean>> {
    try {
      // This would send an email with a magic link
      // For demo purposes, we'll just return success
      console.log(`Magic link would be sent to: ${email}`);

      return {
        success: true,
        data: true,
        message: 'Magic link sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send magic link'
      };
    }
  }

  // Sign out current user
  async signOut(): Promise<ServiceResponse<boolean>> {
    try {
      if (this.currentSession) {
        this.sessions.delete(this.currentSession.token);
        this.currentSession = null;
      }

      return {
        success: true,
        data: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign out'
      };
    }
  }

  // Reset password (placeholder)
  async resetPassword(email: string): Promise<ServiceResponse<boolean>> {
    try {
      // This would send a password reset email
      // For demo purposes, we'll just return success
      console.log(`Password reset would be sent to: ${email}`);

      return {
        success: true,
        data: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send password reset'
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ServiceResponse<User>> {
    try {
      if (!this.currentSession) {
        return {
          success: false,
          error: 'No active session'
        };
      }

      // Check if session is expired
      if (this.currentSession.expiresAt < new Date()) {
        this.currentSession = null;
        return {
          success: false,
          error: 'Session expired'
        };
      }

      const userResult = await userService.get(this.currentSession.userId);
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update last activity
      this.currentSession.lastActivity = new Date();

      return {
        success: true,
        data: userResult.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get current user'
      };
    }
  }

  // Get current session
  getCurrentSession(): AuthSession | null {
    if (!this.currentSession) return null;
    
    // Check if session is expired
    if (this.currentSession.expiresAt < new Date()) {
      this.currentSession = null;
      return null;
    }

    return this.currentSession;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentSession();
  }

  // Get current user ID
  getCurrentUserId(): UserId | null {
    const session = this.getCurrentSession();
    return session?.userId || null;
  }

  // Validate session token
  async validateSession(token: string): Promise<ServiceResponse<User>> {
    try {
      const session = this.sessions.get(token);
      
      if (!session) {
        return {
          success: false,
          error: 'Invalid session token'
        };
      }

      if (session.expiresAt < new Date()) {
        this.sessions.delete(token);
        return {
          success: false,
          error: 'Session expired'
        };
      }

      const userResult = await userService.get(session.userId);
      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update last activity
      session.lastActivity = new Date();

      return {
        success: true,
        data: userResult.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to validate session'
      };
    }
  }

  // Refresh session (extend expiration)
  async refreshSession(): Promise<ServiceResponse<AuthSession>> {
    try {
      if (!this.currentSession) {
        return {
          success: false,
          error: 'No active session'
        };
      }

      // Extend expiration by 7 days
      this.currentSession.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      this.currentSession.lastActivity = new Date();

      return {
        success: true,
        data: this.currentSession,
        message: 'Session refreshed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh session'
      };
    }
  }

  // Set current session (for testing or external auth integration)
  setCurrentSession(userId: UserId): AuthSession {
    const session = this.createSession(userId);
    this.currentSession = session;
    return session;
  }

  // Private helper methods
  private createSession(userId: UserId): AuthSession {
    const session: AuthSession = {
      userId,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.sessions.set(session.token, session);
    return session;
  }

  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  // Clean up expired sessions (should be called periodically)
  async cleanupExpiredSessions(): Promise<ServiceResponse<number>> {
    try {
      const now = new Date();
      let cleaned = 0;

      for (const [token, session] of this.sessions.entries()) {
        if (session.expiresAt < now) {
          this.sessions.delete(token);
          cleaned++;
        }
      }

      // Clear current session if expired
      if (this.currentSession && this.currentSession.expiresAt < now) {
        this.currentSession = null;
      }

      return {
        success: true,
        data: cleaned,
        message: `Cleaned up ${cleaned} expired sessions`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cleanup sessions'
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;