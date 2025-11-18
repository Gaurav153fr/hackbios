// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    // Add your custom field here
    user: {
      id: string; // for example
      // optional field
      fullName?: string;
    } & DefaultSession["user"];
  }
}
