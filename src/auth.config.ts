import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: '/admin/admin-login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthRoute = nextUrl.pathname.startsWith('/admin/admin-login')
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin/dashboard', nextUrl))
        }
        return true
      }

      if (isAdminRoute && !isLoggedIn) {
        return Response.redirect(new URL('/admin/admin-login', nextUrl))
      }
      
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
