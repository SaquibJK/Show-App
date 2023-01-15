const env = require("dotenv");
env.config();
const port = process.env.PORT || 91;
const passport = require("passport");
const User = require("../models/User");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `http://localhost:${port}/route/auth/google/callback`,
    },

    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
          Name: profile.name.givenName,
          img: profile.photos[0].value
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// Serialize and Deserialize User

// used to serialize the user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
