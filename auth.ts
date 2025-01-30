import NextAuth from 'next-auth';
// Your own logic for dealing with plaintext password strings; be careful!
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { UserI as User } from '@/types';
import { CustomAuthError } from '@/lib/custom-auth-error';
import type { LoginResponse } from '@/types/api';

const maxAge = 30 * 24 * 60 * 60; // 30 days

interface UserI extends User {
  token: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    //@its-debo Done
    CredentialsProvider({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        user_type: { label: 'User type', type: 'text' },
        remember: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw CustomAuthError.CredentialsSignin();
        }
        const response = await fetch(`${process.env.API_URL}/v0/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        console.debug(
          'ℹ️ ~ file: auth.ts:27 ~ authorize ~ response:',
          response
        );

        const data = (await response.json()) as LoginResponse;
        console.debug('ℹ️ ~ file: auth.ts:43 ~ authorize ~ data:', data);
        if (data?.status) {
          return { maxAge, token: data?.token, ...data?.user };
        } else if (!data?.status && !data?.user) {
          if (data?.error === 'User_Not_Found' && data?.status_code === 404) {
            throw CustomAuthError.UserNotFound();
          } else if (
            data?.error === 'Incorrect_Password' &&
            data?.status_code === 401
          ) {
            throw CustomAuthError.IncorrectPassword();
          } else if (
            data?.error === 'Email_Not_Verified' &&
            data?.status_code === 400
          ) {
            throw CustomAuthError.EmailNotVerified();
          } else if (
            data?.error === 'Internal_Server_Error' &&
            data?.status_code === 500
          ) {
            throw CustomAuthError.InternalServerError();
          }
        }
      },
    }),
    Google,
  ],

  callbacks: {
    async jwt({ user, token, session, trigger }) {
      if (trigger === 'update') {
        console.log('Upading user');
        token = {
          ...token,
          user: {
            ...(token.user as UserI),
            ...session.user,
          },
        };
      }

      if (user && trigger === 'signIn') {
        token.user = {
          ...(token.user as UserI),
          ...user,
        };

        token.token = (token.user as UserI)?.token;
        // @ts-expect-error - `token` is not defined in the type
        token['maxAge'] = user.maxAge;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && token.user) {
        const { token: userToken, ...userData } = token.user as UserI;
        session = {
          ...session,
          user: userData,
          token: userToken,
          maxAge: token.maxAge,
          // @ts-expect-error - `expires` is not defined in the type
          expires: new Date(Date.now() + token.maxAge * 1000).toISOString(),
        };
      }
      return session;
    },
    async authorized({ req, auth }) {
      return !!auth;
    },
  },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',
    maxAge,
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 'Session', // 10 minute

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours

    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    // generateSessionToken: () => {
    //   return randomUUID?.() ?? randomBytes(32).toString("hex")
    // }
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth',
  },
});
