import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email as string },
        });

        if (!admin) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password as string, admin.password_hash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Update last login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { last_login_at: new Date() },
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.full_name,
        }
      },
    }),
  ],
})
