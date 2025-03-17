# AI Resume Builder

A modern resume builder application that uses AI to help you create professional resumes. Built with Next.js, TypeScript, and OpenAI.

## Features

- Google Authentication
- AI-powered resume content generation
- Multiple resume templates
- Manual resume editing
- Secure API key storage
- MongoDB for data persistence

## Prerequisites

- Node.js 18.x or later
- MongoDB database
- Google OAuth credentials
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-builder.git
cd resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. Set up Google OAuth:
   - Go to the Google Cloud Console
   - Create a new project
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs (http://localhost:3000/api/auth/callback/google)
   - Copy the client ID and client secret to your `.env` file

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in with your Google account
2. Go to Settings and add your OpenAI API key
3. Choose a resume template from the home page
4. Either:
   - Click "Generate with AI" to automatically generate resume content
   - Or manually fill in your resume details
5. Save your resume

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
