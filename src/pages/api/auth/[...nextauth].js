import NextAuth from "next-auth";
//import GoogleProvider from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export default NextAuth({
  providers: [
//    GoogleProvider({
//      clientId: process.env.GOOGLE_CLIENT_ID,
//      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

  ],
  secret: process.env.AUTH_SECRET, // Required for JWT encryption
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});
