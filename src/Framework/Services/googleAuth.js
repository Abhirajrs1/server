  import passport from 'passport';
  import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
  import userUseCase from '../../Application/Usecase/userUsecase.js';

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // const existingUser = await userUseCase.findOrCreateGoogleUser(profile);
          done(null, profile);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (user, done) => {
    try {
      // const user = await userUseCase.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  export default passport;
