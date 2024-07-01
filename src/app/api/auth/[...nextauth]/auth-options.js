import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import connect from "../../../utils/db";
import mongoose from 'mongoose';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
       // ... your CredentialsProvider configuration
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? "",
    //   clientSecret: process.env.GITHUB_SECRET ?? "",
    // }),
    GoogleProvider({
            // ... your GoogleProvider configuration
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(params) {
      const {user, account } = params;

        // Check if account is null
        if (!account) {
          return false;
        }


      if (account.provider == "credentials") {
        return true;
      }
      if (account.provider == "github") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }

      if(account.provider == "google"){
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }

      if(account.provider == "twitter"){
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }

    },
    // async session({ session, token, user }) {
    //   // Get the user's tier from your database
    //   const userFromDB = await User.findById(token.sub);
    //   const userTier = userFromDB.tier;
  
    //   // Add the 'tier' value to the session object
    //   session.user.tier = userTier;
  
    //   return session;
    // },

    async session({ session, token, user }) {
      try {
        let userFromDB;
        let objectId;
  
        // Try to create an ObjectId from token.sub
        if (mongoose.isValidObjectId(token.sub)) {
          objectId = token.sub; // token.sub is already a valid ObjectId string
        } else {
          console.log(`Invalid ObjectId: ${token.sub}`);
          return session; // or handle this case as needed
        }
  
        // Now use findById with the ObjectId string
        userFromDB = await User.findById(objectId);
  
        if (userFromDB) {
          // Add the 'tier' value to the session object
          session.user.tier = userFromDB.tier;
          // Optionally, add other user properties to the session
          session.user.id = userFromDB._id.toString(); // Ensure it's a string in the session
        } else {
          console.log(`User not found for ID: ${token.sub}`);
          // You might want to set a default tier or handle this case
          session.user.tier = 'default';
        }
  
      } catch (error) {
        console.error('Error in session callback:', error);
        // Handle the error appropriately
      }
  
      return session;
    },

  },
};


// Adding additonal values to the session object!

// locate the callbacks object and modify the session callback:
//In the session callback, you can access the token object, which typically contains the user's ID (token.sub). Use this ID to fetch the user's data from your database, including the tier value.
//Once you have the user's data from the database, assign the tier value to session.user.tier.
//Return the updated session object.
