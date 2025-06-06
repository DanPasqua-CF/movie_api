const { default: mongoose } = require('mongoose');

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models'),
  passportJWT = require('passport-jwt');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, callback) => {
      try {
        // Validate input format to prevent NoSQL injections
        if (typeof username !== 'string' || !/^[a-zA-Z0-9]+$/.test(username)) {
          return callback(null, false, { message: 'Invalid username format' });
        }

        const user = await Users.findOne({ username: username.trim() });

        if (!user) {
          console.log('Incorrect username');
          return callback(null, false, { message: 'Incorrect username' });
        }

        if (!user.validatePassword(password)) {
          console.log('Incorrect password');
          return callback(null, false, { message: 'Incorrect password' });
        }

        console.log('Login successful');
        return callback(null, user);
      }
      catch (error) {
        console.log(error);
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret'
    }, 
    async (jwtPayload, callback) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(jwtPayload._id)) {
          return callback(null, false);
        }

        const user = await Users.findById(jwtPayload._id);
        if (user) {
          return callback(null, user);
        } 
        else {
          return callback(null, false);
        }
      } 
      catch (error) {
        return callback(error);
      }
    }
  )
);
