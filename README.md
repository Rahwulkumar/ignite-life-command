# Ignite Life Command

A comprehensive life management application built with React, TypeScript, and Supabase.

## 🚀 Features

- **Multi-Domain Life Management**: Finance, Trading, Tech, Spiritual, Music, Content, and Projects
- **AI-Powered Coaches**: Domain-specific AI assistants for personalized guidance
- **Note-Taking System**: Hierarchical notes with rich text editing
- **Real-time Sync**: Powered by Supabase for seamless data synchronization
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Supabase** - Backend as a service (database, auth, storage)
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animation library

## 📋 Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account - [create one here](https://supabase.com)

## 🏃 Getting Started

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd ignite-life-command
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```sh
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

Get your credentials from: https://app.supabase.com/project/_/settings/api

### 4. Start the development server

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── shared/         # Shared components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── finance/        # Finance domain components
│   ├── trading/        # Trading domain components
│   ├── tech/           # Tech domain components
│   ├── spiritual/      # Spiritual domain components
│   ├── music/          # Music domain components
│   ├── notes/          # Notes system components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
│   ├── mockData.ts     # Centralized mock data
│   ├── env.ts          # Environment validation
│   ├── tiptapUtils.ts  # Rich text utilities
│   └── utils.ts        # General utilities
├── pages/              # Page components
└── main.tsx            # Application entry point
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable (anon) key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

See `.env.example` for more details.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add your environment variables
6. Deploy!

### Other Platforms

This is a standard Vite + React app and can be deployed to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📝 Code Quality

This project follows best practices:

- ✅ TypeScript for type safety
- ✅ ESLint for code quality
- ✅ Centralized mock data
- ✅ Environment variable validation
- ✅ Error boundaries for graceful error handling
- ✅ Reusable component architecture

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
