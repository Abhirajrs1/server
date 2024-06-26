import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { User } from "../../Core/Entities/userCollection.js";

console.log(process.env.CLIENT_ID);


passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.CLIENT_ID || " ",
      clientSecret: process.env.CLIENT_SECRET || " ",
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user=await User.findOne({googleId:profile.id})
            if(!user){
                user = new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true, // Assuming Google users are verified
                  });
                  await user.save();
            }
            return done(null, user)

        } catch (error) {
            done(error, null);
        }
    }
  )
);

// Serialize and deserialize user functions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

export default passport