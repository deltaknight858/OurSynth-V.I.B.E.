# Pathways - AI Component Generator

A sleek, glass-morphism styled Next.js application that uses AI to generate beautiful React components. Built with TypeScript, Material UI, Supabase for authentication and database, and OpenAI for component generation.

## 🚀 Features

- **AI-Powered Component Generation**: Generate React components using OpenAI GPT-4
- **Glass Morphism Design**: Beautiful, modern UI with glass-morphism effects
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Component Library**: Save and manage your generated components
- **Code Preview**: View and copy generated component code
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Material UI v5 + Custom Glass CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- An OpenAI API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pathways
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase Database**
   
   Create the following table in your Supabase database:
   
   ```sql
   CREATE TABLE user_components (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     title TEXT NOT NULL,
     prompt TEXT NOT NULL,
     generated_code TEXT NOT NULL,
     preview_image_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable RLS (Row Level Security)
   ALTER TABLE user_components ENABLE ROW LEVEL SECURITY;
   
   -- Create policy to allow users to only access their own components
   CREATE POLICY "Users can only access their own components" ON user_components
     FOR ALL USING (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Features Overview

### Component Generation
- Enter a description of the React component you want
- AI generates clean, production-ready TypeScript React code
- Code includes proper Material UI styling and TypeScript types

### User Authentication
- Secure email/password authentication via Supabase
- Protected routes for signed-in users
- User session management

### Component Library
- Save generated components to your personal library
- View, copy, and delete saved components
- Search and filter your components

### Glass Morphism UI
- Beautiful gradient backgrounds with animation
- Glass-morphism cards and components
- Smooth transitions and hover effects
- Responsive design for all screen sizes

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── generate/       # OpenAI API endpoint
│   ├── auth/              # Authentication pages
│   │   ├── signin/
│   │   └── signup/
│   ├── saved/             # Saved components page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── generator/         # Component generation UI
│   ├── layout/           # Layout components
│   ├── saved/            # Saved components UI
│   └── theme/            # Material UI theme
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities and configurations
│   └── supabase.ts       # Supabase client
└── styles/               # CSS files
    └── glass.css         # Glass morphism styles
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js, such as:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Material UI](https://mui.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for backend-as-a-service
- [OpenAI](https://openai.com/) for the powerful GPT-4 API
- Glass morphism design inspiration from various UI/UX communities

## 🐛 Issues

If you encounter any issues, please feel free to [open an issue](https://github.com/your-username/pathways/issues) on GitHub.

## 📞 Support

For support, email your-email@example.com or join our Discord community.

---

**Happy coding!** 🚀✨
