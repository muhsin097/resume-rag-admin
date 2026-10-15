import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Same delegation pattern as resume-rag-web: NextAuth never touches the
// User table directly, it just holds onto the Nest-issued access token.
// The one difference here is the isAdmin check in authorize() -- this app
// shares the same /auth/login endpoint and User table as the candidate
// app, so a non-admin account must be rejected right here, not just hidden
// behind a redirect after the fact.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.RESUME_API_BASE_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        if (!data.user.isAdmin) {
          return null;
        }

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          accessToken: data.accessToken,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
