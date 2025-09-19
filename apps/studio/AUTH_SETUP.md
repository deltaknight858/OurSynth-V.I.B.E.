# Authentication Setup Guide

This guide explains the authentication system in OurSynth using Supabase Auth UI.

## Authentication Pages

### Login Page (`/login`)
- **Purpose**: Sign in existing users
- **Features**:
  - Email/password authentication
  - Social providers (Google, GitHub)
  - Magic link authentication
  - Automatic redirect to `/studio` on successful login
  - Link to signup page for new users

### Signup Page (`/signup`)
- **Purpose**: Register new users
- **Features**:
  - Email/password registration
  - Social providers (Google, GitHub)
  - Feature highlights for new users
  - Automatic redirect to `/studio` on successful registration
  - Link to login page for existing users

## Authentication Flow

### 1. User Registration/Login
```
User visits /signup or /login
↓
Supabase Auth UI handles authentication
↓
On success: Redirect to /studio
On error: Display error message
```

### 2. Authentication State Management
- Uses direct Supabase client calls (not AuthContext for these pages)
- Checks for existing session on page load
- Listens for auth state changes
- Redirects authenticated users away from auth pages

### 3. Redirect Behavior
- **After Login**: Users are redirected to `/studio`
- **After Signup**: Users are redirected to `/studio`
- **Already Authenticated**: Users are immediately redirected to `/studio`

## Styling & Design

### Glass-morphism Theme
Both pages use the consistent glass-morphism design:
- Translucent background with backdrop filter
- Gradient text for titles
- Styled form inputs with custom focus states
- Animated buttons with hover effects

### Responsive Design
- Mobile-friendly layouts
- Flexible card containers
- Proper spacing and typography

### Custom Supabase Auth UI Styling
```css
/* Override default Supabase styles */
.supabase-auth-ui_ui input {
  background: var(--glass-background-dark) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: var(--text-primary) !important;
}

.supabase-auth-ui_ui button {
  background: var(--primary-gradient) !important;
  border: none !important;
}
```

## Configuration

### Supabase Setup
```typescript
// Both pages use the Supabase client directly
import { supabase } from '@/lib/supabase'

// Auth UI configuration
<Auth
  supabaseClient={supabase}
  view="sign_in" // or "sign_up"
  providers={['google', 'github']}
  redirectTo="/auth/callback"
/>
```

### Authentication Providers
- **Email/Password**: Default authentication method
- **Google**: Social authentication
- **GitHub**: Social authentication
- **Magic Link**: Available on login page only

## Security Features

### Row Level Security (RLS)
- User projects are protected by RLS policies
- Users can only access their own data
- Templates are publicly readable but user projects are private

### Redirect Validation
- All redirects go through `/auth/callback`
- Proper validation of authentication state
- Safe redirect handling

## Usage Instructions

### For Users
1. **New Users**: Visit `/signup` to create an account
2. **Existing Users**: Visit `/login` to sign in
3. **Forgot Password**: Use the "Forgot Password" link on login page
4. **Social Login**: Click Google or GitHub buttons for quick access

### For Developers
1. **Environment Setup**: Configure Supabase credentials in `.env.local`
2. **Auth Callback**: Ensure `/auth/callback` route is properly configured
3. **RLS Policies**: Set up proper database policies for user data
4. **Email Templates**: Configure Supabase email templates for verification

## Error Handling

### Common Scenarios
- **Invalid Credentials**: Clear error message displayed
- **Email Not Verified**: Supabase handles verification flow
- **Network Errors**: Graceful fallback with retry options
- **Rate Limiting**: Supabase handles rate limiting automatically

### User Feedback
- Loading states during authentication
- Clear success/error messages
- Proper redirection with loading indicators
- Accessible error descriptions

## Integration with App

### Navigation
- Authentication pages are standalone (not in main navigation)
- Users access them via direct links or redirects
- No nav links shown to authenticated users

### State Management
- Pages use local state for auth checks
- No dependency on AuthContext during SSG
- Real-time auth state monitoring
- Proper cleanup of subscriptions

### Templates & Projects
- Templates can be browsed without authentication
- Using templates requires authentication
- User projects are created after template usage
- Proper user association with projects

## Testing

### Manual Testing
1. Visit `/signup` and create a new account
2. Verify email if required
3. Check redirect to `/studio`
4. Sign out and test `/login`
5. Test social providers
6. Test "Use Template" flow with authentication

### Development Testing
- Test with and without Supabase configuration
- Verify SSG compatibility
- Check mobile responsiveness
- Test error scenarios
