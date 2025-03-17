import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add credentials provider for development
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For development, validate credentials against database
        if (credentials?.email === 'test@example.com' && credentials?.password === 'password') {
          return {
            id: '1234567890',
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://via.placeholder.com/150',
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const { db } = await connectToDatabase();
          
          // Check if user exists
          const existingUser = await db.collection('users').findOne({
            email: user.email,
          });

          if (!existingUser) {
            // Create new user
            await db.collection('users').insertOne({
              email: user.email,
              name: user.name,
              image: user.image,
              resumes: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          // Continue even if there's an error to prevent login failures
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 