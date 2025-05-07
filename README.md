# EducLydIA - AI-Powered Study Material Generator


EducLydIA is a Next.js-based platform that leverages Google's Generative AI to create personalized study materials for various learning purposes. The application allows users to generate comprehensive learning resources tailored to their specific topics and learning needs.

## Features

- **AI-Generated Study Materials**: Create personalized learning content using Google's Generative AI (Gemini)
- **Multiple Learning Formats**: Access your content as notes, flashcards, quizzes, and Q&A
- **Customizable Difficulty Levels**: Choose between Easy, Moderate, and Hard difficulty settings
- **Purpose-Based Learning**: Generate materials for exams, job interviews, practice, coding, or other purposes
- **User Authentication**: Secure user authentication powered by Clerk
- **Progress Tracking**: Monitor your learning progress through the dashboard
- **Background Processing**: Reliable content generation with Inngest

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Inngest for background processing
- **Database**: PostgreSQL (via Neon), Drizzle ORM
- **AI**: Google Generative AI (Gemini)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, CSS Modules

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (or Neon account)
- Google Generative AI API key
- Clerk account for authentication

### Environment Setup

Create a `.env` file with the following variables:

```env
# Database
NEXT_PUBLIC_DATABASE_CONNECTION_STRING=your_neon_db_connection_string

# Google Generative AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/edu-platforme.git
   cd edu-platforme
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Start the Inngest development server:
   ```bash
   npx inngest-cli@latest dev
   ```

5. (Optional) Start the Drizzle studio to manage your database:
   ```bash
   npx drizzle-kit studio
   ```

6. Open [http://localhost:4000](http://localhost:4000) with your browser to see the application.

## Project Structure

```
edu-platforme/
├── app/                   # Next.js app router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   ├── course/            # Course view pages
│   ├── create/            # Course creation flow
│   ├── dashboard/         # User dashboard
│   └── layout.js          # Root layout
├── components/            # Reusable UI components
├── configs/               # Configuration files
│   ├── AiModel.js         # AI model configuration
│   ├── db.js              # Database connection
│   └── schema.js          # Database schema
├── inngest/               # Background job processing
│   ├── client.js          # Inngest client
│   └── functions.js       # Background functions
├── lib/                   # Utility functions
├── public/                # Static assets
└── README.md              # Project documentation
```

## Key Workflows

### Course Creation Flow

1. User selects a study material purpose (Exam, Job Interview, etc.)
2. User enters a topic and selects difficulty level
3. System uses AI to generate course outline
4. Background processing creates chapter notes and study materials
5. User receives notification when content is ready

### Study Material Generation

- Course outlines are generated using Google's Generative AI
- Each chapter has detailed notes with summaries and topics
- Additional study formats (flashcards, quizzes) can be generated on demand

## License

[MIT License](LICENSE)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Google Generative AI](https://ai.google.dev/)
- [Clerk](https://clerk.com/)
- [Inngest](https://www.inngest.com/)
- [Neon Database](https://neon.tech/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
