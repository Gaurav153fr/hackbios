import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/app/generated/prisma";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  session: {
    strategy: "jwt", // REQUIRED for credentials login
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        workEmail: { label: "Work Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.workEmail || !credentials.password) {
          throw new Error("Email or Password missing");
        }

        const user = await prisma.user.findUnique({
          where: { workEmail: credentials.workEmail },
        });

        if (!user) throw new Error("User not found");
console.log("user", user);

        // If you are using plain passwords temporarily:
        if (user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        // Return user → Will be encoded into JWT
        return {
          id: user.id,
          workEmail: user.workEmail,
          fullName: user.fullName,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On login, `user` is available
      if (user) {
        token.id = user.id;
        token.workEmail = user.workEmail;
        token.fullName = user.fullName;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.workEmail = token.workEmail;
      session.user.fullName = token.fullName;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
