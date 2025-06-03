const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

/* Models */
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

// app.use()
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

/* Environment */
const host = '127.0.0.1';

mongoose.connect(`mongodb://${host}:27017/myFlix`, { useNewUrlParser: true, useUnifiedTopology: true });


/*  CREATE  */

/** Add a new user
 *
 *  JSON FORMAT:
 *    username: String,
 *    password: String,
 *    email: String,
 *    birthday: Date
 */
app.post('/users', 
  [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Only alphanumeric values allowed').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Invalid email address').isEmail()
  ], async (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.password);

  await Users.findOne({ name: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.name} already exists`);
      }
      else {
        Users.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthday: req.body.birthday
        })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    });
});

// Add a new movie to a user's list
app.post('/users/:username/favoriteMovies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $push: {
      favoriteMovies: req.params.movieId
    },
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});


/*  READ  */

// Get a list of all movies
app.get('/movies', async (req, res) => {
  await Movies.find().then((movies) => {
    res.status(200).json(movies);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a director's information by name
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const directorName = req.params.name;

    // Search for a movie that contains the director
    const movie = await Movies.findOne({
      'directors.name': new RegExp(`^${directorName}$`, 'i')
    });

    if (!movie) {
      return res.status(404).send('Director not found in any movie.');
    }

    // Find the matching director object from the array
    const director = movie.directors.find(d =>
      d.name.toLowerCase() === directorName.toLowerCase()
    );

    if (!director) {
      return res.status(404).send('Director found in movie, but could not extract full details.');
    }

    res.status(200).json({
      name: director.name,
      biography: director.biography,
      birthYear: director.birthYear,
      deathYear: director.deathYear
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Get a list of users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a user's information by name
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get genres
app.get('/genres/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Genres.find()
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get genre information by name
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Genres.findOne({ name: req.params.name })
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});


/*  UPDATE  */

/** Update a user
 *
 *  JSON FORMAT:
 *    username: String,
 *    password: String,
 *    email: String,
 *    birthday: Date
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }), 
[
  check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Only alphanumeric values allowed').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Invalid email address').isEmail()
], async (req, res) => {
  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.user.username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }
  
  await Users.findOneAndUpdate({ username: req.params.username }, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday
    }
  },
    { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});


/*  DELETE  */

// Delete a user
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(`${req.params.username} not found`);
      }
      else {
        res.status(200).send(`${req.params.username} was deleted`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Remove a movie from a user's list
app.delete('/users/:username/favoriteMovies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { username, movieId } = req.params;

    // Validate movieId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).send(`Invalid movie ID: ${ movieId }`);
    }

    const updatedUser = await Users.findOneAndUpdate(
      { username },
      { $pull: { favoriteMovies: movieId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send(`${username} not found`);
    }

    res.status(200).json({
      message: `Movie ${movieId} removed`,
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server error: ${ err.message }`);
  }
});


/*  Error handling  */
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
