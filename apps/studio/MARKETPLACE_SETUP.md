# Marketplace Setup Guide

This guide will help you set up the marketplace functionality with Supabase.

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the API settings

### 2. Set Up Environment Variables
Add your Supabase credentials to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Table
Run the SQL script in your Supabase SQL Editor:
```bash
# The script is located at: supabase-setup.sql
```

This will create:
- `apps` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies
- Sample data for testing

## 📊 Table Structure

The `apps` table includes:
- **id**: Unique identifier (UUID)
- **name**: App/product name
- **description**: Product description
- **price**: Price in USD (0.00 for free)
- **rating**: Star rating (0.0 - 5.0)
- **thumbnail_url**: Product image URL
- **category**: Product category
- **download_url**: File download link
- **file_size**: File size in bytes
- **downloads_count**: Download counter
- **author_id**: Creator's user ID
- **tags**: Array of searchable tags
- **is_featured**: Featured product flag
- **is_active**: Active/inactive status
- **created_at** / **updated_at**: Timestamps

## 🔐 Security

Row Level Security (RLS) is enabled with policies:
- **Public read**: Anyone can view active apps
- **Authenticated insert**: Users can create their own apps
- **Owner update/delete**: Users can modify their own apps

## 🎨 Features

The marketplace page includes:

### 🔍 **Search & Filter**
- Real-time search by name and description
- Category filtering (Synthesizers, Samples, Effects, etc.)
- Glass-morphism styled search interface

### 📱 **Product Cards**
- Thumbnail images with fallback icons
- Star ratings with visual display
- Price formatting (shows "Free" for $0.00)
- Hover effects with glass-morphism styling

### 🎯 **Responsive Design**
- Grid layout that adapts to screen size
- Mobile-friendly interface
- Loading and error states

### 🔄 **Fallback Data**
If Supabase is not configured, the page will automatically use mock data for development and testing.

## 🚀 Usage

1. **Development**: The page works immediately with mock data
2. **Production**: Configure Supabase environment variables
3. **Content**: Add products via Supabase dashboard or API

## 📝 Customization

You can modify:
- Categories in the filter array
- Product card styling
- Search functionality
- Mock data for development

The marketplace is fully integrated with your theme system and uses glass-morphism styling throughout.
