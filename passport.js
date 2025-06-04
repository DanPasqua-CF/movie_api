const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, callback) => {
      await Users.findOne({ username: username})
      .then((user) => {
        if (!user) {
          console.log('Incorrect username');
          return callback(null, false, { message: 'Incorrect username' });
        }

        if (!user.validatePassword(password)) {
          console.log('Incorrect password');
          return callback(null, false, { message: 'Incorrect password' });
        }

        console.log('Finished');
        return callback(null, user);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
          return callback(error);
        }
      });
    }
  )
);

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, async (jwtPayload, callback) => {
  try {
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
}));
