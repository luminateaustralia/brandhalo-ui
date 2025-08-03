import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


// Extend the built-in session and user types
declare module "next-auth" {
  interface User {
    apiKey?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      apiKey?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiKey?: string;
  }
}

// Define fallback secret (not recommended for production)
const AUTH_SECRET = process.env.AUTH_SECRET || "ZmdQFvLiXx2N5ODidoaKpOSehhUN7HoDIgV76tvtDjM=";

export const { 
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  secret: AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.apiKey = user.apiKey;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.apiKey = token.apiKey as string;
      }
      return session;
    }
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials", { email: !!credentials?.email, password: !!credentials?.password });
          return null;
        }
        
        try {
          console.log("Checking credentials for:", credentials.email);
          
          // In a real app, you would validate credentials with your API
          // For demo purposes, we're using simple validation
          if (credentials.email === "user@example.com" && credentials.password === "password") {
            console.log("Login successful for demo user");
            return {
              id: "1",
              name: "Demo User",
              email: credentials.email,
              apiKey: "demo-api-key-12345" // This would come from your auth API
            };
          }
          
          // Add your custom credentials here
          // Example: 
          if (credentials.email === "your.email@example.com" && credentials.password === "your-password") {
            console.log("Login successful for custom user");
            return {
              id: "2",
              name: "Your Name",
              email: credentials.email,
              apiKey: "your-api-key-12345"
            };
          }
          
          console.log("Invalid credentials for:", credentials.email);
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true, // Add this to avoid warnings on localhost
}); 