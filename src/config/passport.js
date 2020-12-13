const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const User = require("../models/User");

passport.use(
  "local-signin",
  new localStrategy(
    {
      usernameField: "email1",
    },
    async (email1, password, done) => {
      const user = await User.findOne({ email1: email1 });
      if (!user)
        return done(null, false, {
          message: "Not user found",
          status: 400,
        });
      else {
        const match = await user.matchPassword(password.toString());
        if (match)
          return done(null, user, {
            message: "User logged in",
            status: 200,
          });
        else
          return done(null, false, {
            message: "Incorrect Password",
            status: 400,
          });
      }
    }
  )
);

passport.use(
  "local-signup",
  new localStrategy(
    {
      usernameField: "email1",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email1, password, done) => {
      const { firstName, lastName, confirmPassword } = req.body;

      if (!firstName || !lastName || !email1 || !password || !confirmPassword)
        return done(null, false, {
          message: "Incomplete data",
          status: 400,
        });

      const user = await User.findOne({ email1: email1 });
      if (user)
        return done(null, false, {
          message: "The email is already taken.",
          status: 400,
        });

      const newUser = new User(req.body);
      const checkEmail = newUser.emailIsValid(email1);
      const checkPassword = newUser.passwordIsValid(password);

      if (!checkEmail)
        return done(null, false, {
          message: "The email format is not valid",
          status: 400,
        });
      if (!checkPassword)
        return done(null, false, {
          message: "The password format is not valid",
          status: 400,
        });
      if (password != confirmPassword)
        return done(null, false, {
          message: "Password do not match",
          status: 400,
        });
      newUser.password = await newUser.encryptPassword(password.toString());

      await newUser.save();
      return done(null, newUser, {
        message: "Registered user",
        status: 201,
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
