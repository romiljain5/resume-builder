# Resume Builder Deployment Guide

This document provides instructions for deploying the Resume Builder application to various platforms.

## Prerequisites

- Node.js version 18.18.0 or higher
- npm or yarn
- MongoDB database instance
- Google OAuth credentials (for authentication)
- OpenAI API key (optional, for AI-generated content)
- Anthropic API key (optional, for AI-generated content)

## Environment Variables

The following environment variables are required:

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

1. Push your code to GitHub, GitLab, or Bitbucket
2. Sign up or log in to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure the environment variables
6. Click "Deploy"

The application will be deployed automatically, and you'll receive a URL for your site.

### 2. Netlify

1. Push your code to GitHub, GitLab, or Bitbucket
2. Sign up or log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Set build command to `npm run build`
6. Set publish directory to `.next`
7. Configure the environment variables
8. Click "Deploy site"

### 3. Railway

1. Push your code to GitHub
2. Sign up or log in to [Railway](https://railway.app)
3. Click "New Project" > "Deploy from GitHub"
4. Choose your repository
5. Configure the environment variables
6. The application will be deployed automatically

### 4. Docker Deployment

The application can also be deployed using Docker:

1. Build the Docker image:
   ```
   docker build -t resume-builder .
   ```

2. Run the container:
   ```
   docker run -p 3000:3000 --env-file .env resume-builder
   ```

## Database Setup

The application uses MongoDB for data storage. Here are the steps to set up the database:

1. Create a MongoDB Atlas account or use a self-hosted MongoDB instance
2. Create a new database called `resume-builder`
3. Set up the connection string in your environment variables

## Troubleshooting

- If you encounter issues with authentication, verify that your `NEXTAUTH_URL` is correctly set to your deployed domain
- For database connection issues, ensure your IP is whitelisted in MongoDB Atlas
- If OAuth login fails, check that your Google OAuth credentials are correctly configured with the appropriate redirect URIs

## Custom Domain Setup

To use a custom domain with your deployed application:

### On Vercel:
1. Go to your project settings
2. Navigate to the "Domains" section
3. Add your custom domain
4. Update your DNS settings as instructed

### On Netlify:
1. Go to your site settings
2. Navigate to the "Domain management" section
3. Click "Add custom domain"
4. Follow the DNS configuration instructions

## Updates and Maintenance

To update your deployed application:

1. Make changes to your code
2. Push to your repository
3. The application will automatically redeploy on Vercel/Netlify

For manual updates, you can run:
```
npm run build
npm run start
``` 