import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "../../../../src/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Get user from MySQL
        const [rows]: any = await db.query(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [credentials.email]
        );

        const user = rows[0];
        if (!user) return null;

        // Verify password (column is password_hash in DB)
        const isValid = await compare(credentials.password, user.password_hash || user.password);
        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: "student", // role column doesn't exist in schema
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = (token.role as string) || "student";
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
