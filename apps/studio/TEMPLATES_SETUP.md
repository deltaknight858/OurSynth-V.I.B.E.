# Templates Setup Guide

This guide explains how to set up and use the templates feature in OurSynth.

## Database Setup

### 1. Run the Additional SQL Script

After setting up the main database with `supabase-setup.sql`, run the additional templates setup:

```sql
-- Run this in your Supabase SQL Editor after the main setup
-- File: templates-setup.sql
```

This will create:
- `user_projects` table for storing user's template projects
- Additional template data in the `apps` table
- Proper RLS policies for user projects

### 2. Table Structure

#### user_projects Table
- `id`: UUID primary key
- `user_id`: References auth.users(id)
- `name`: Project name
- `description`: Project description
- `template_id`: References the original template in apps table
- `project_data`: JSONB field for storing project configuration
- `thumbnail_url`: Project thumbnail
- `tags`: Array of tags
- `is_public`: Whether the project is publicly visible
- `created_at` / `updated_at`: Timestamps

## Features

### Template Display
- **Grid Layout**: Responsive grid showing template cards
- **Preview Images**: Visual previews with gradient fallbacks
- **Rating System**: Star ratings for each template
- **Price Display**: Clear pricing information
- **Tag Filtering**: Filter templates by genre/category tags

### Search & Filter
- **Search Bar**: Search templates by name or description
- **Tag Filters**: Click tags to filter templates by category
- **Real-time Filtering**: Instant results as you type

### Template Usage
- **Use Template Button**: One-click template duplication
- **User Authentication**: Requires sign-in to use templates
- **Project Creation**: Creates a new project from template data
- **Status Feedback**: Success/error messages for user actions

### Fallback System
- **Mock Data**: Works without Supabase configuration
- **Demo Mode**: Simulates template usage when not connected
- **Error Handling**: Graceful degradation on API errors

## Template Data Structure

Templates are stored in the `apps` table with `category = 'Templates'`. Each template includes:

```typescript
interface Template {
  id: string
  name: string
  description?: string
  price: number
  rating: number
  thumbnail_url?: string
  tags?: string[]
  created_at: string
}
```

## Project Data Structure

When a user uses a template, it creates a project with this structure:

```typescript
interface UserProject {
  user_id: string
  name: string
  description?: string
  template_id: string
  project_data?: {
    originalTemplate: string
    createdFrom: 'template'
    version: string
    // Additional project configuration would go here
    // synthesizers, effects, arrangements, etc.
  }
  thumbnail_url?: string
  tags?: string[]
}
```

## Usage Flow

1. **Browse Templates**: Users see a grid of available templates
2. **Filter/Search**: Users can narrow down templates by tags or search
3. **Preview**: Users can see template details, rating, price, and tags
4. **Use Template**: Authenticated users click "Use Template"
5. **Project Creation**: System creates a new project in `user_projects` table
6. **Confirmation**: User receives feedback about successful template usage

## Styling

The templates page uses the same glass-morphism design system as the rest of the app:
- **Glass backgrounds** with backdrop filters
- **Gradient text** for headings
- **Hover effects** with smooth transitions
- **Responsive design** for all screen sizes
- **Consistent spacing** using CSS custom properties

## Authentication Integration

- **Supabase Auth**: Uses existing authentication system
- **Real-time Updates**: Listens for auth state changes
- **User Context**: Tracks current user for template usage
- **Protected Actions**: Only authenticated users can use templates

## Error Handling

- **Network Errors**: Fallback to mock data
- **Auth Errors**: Clear messaging for sign-in requirements
- **Database Errors**: Graceful error messages
- **Loading States**: Spinner animations during operations

## Development Notes

- Templates are fetched from the same `apps` table as marketplace items
- Uses `category = 'Templates'` filter to separate from other products
- Mock data provides 6 sample templates for development
- All styled-components follow the existing theme system
- TypeScript interfaces ensure type safety throughout

## Future Enhancements

- **Preview Playback**: Add audio preview functionality
- **Template Categories**: More sophisticated categorization
- **User Ratings**: Allow users to rate templates
- **Template Sharing**: Enable users to share their own templates
- **Collaboration**: Multi-user template editing
- **Version Control**: Track template and project versions
