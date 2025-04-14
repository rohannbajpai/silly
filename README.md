# SILLY.com

A playful, personalized self-improvement web application that makes personal growth less intimidating and more engaging through a fun interface, personalized onboarding, adaptable content, and an interactive mascot ("Blobby").

## Prerequisites

- Node.js (LTS version, e.g., v20.x.x)
- npm or yarn (latest stable version)
- Git (latest stable version)
- VS Code (Recommended IDE) with Prettier & ESLint extensions

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd silly-com-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your Firebase configuration values.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes (login, signup)
│   ├── (main)/            # Main app routes (dashboard)
│   └── onboarding/        # Onboarding flow
├── components/            # React components
│   ├── blobby/           # Blobby mascot components
│   ├── goals/            # Goal management components
│   ├── feedback/         # User feedback components
│   ├── onboarding/       # Onboarding components
│   └── ui/               # Shadcn UI components
├── contexts/             # React contexts
├── lib/                  # Utilities and constants
└── types/               # TypeScript type definitions
```

## Technology Stack

- Framework: Next.js (^14.2.0)
- Language: TypeScript (^5.4.0)
- UI Library: React (^18.2.0)
- Styling: Tailwind CSS (^3.4.0)
- UI Components: Shadcn/ui
- State Management: Zustand (^4.5.0)
- Animation: 
  - lottie-react (^2.4.0)
  - framer-motion (^11.0.0)
- Database: Firebase Firestore
- Authentication: Firebase Authentication
- Hosting: Vercel

## Development Guidelines

1. Follow the TypeScript and ESLint configurations
2. Use Prettier for code formatting
3. Follow the component structure and naming conventions
4. Keep components small and focused
5. Use Tailwind CSS for styling
6. Implement responsive design for all components
7. Write meaningful commit messages

## License

[Add your license here]
