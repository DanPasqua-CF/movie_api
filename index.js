const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models');
// const bodyParser = require('body-parser');

/* Models */
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;

// app.use()
const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

/* Environment */
const host = '127.0.0.1';
const PORT = 8080;

mongoose.connect(`mongodb://${host}:27017/myFlix`, { useUnifiedTopology: true });


/*  CREATE  */

/** Add a new user
 *
 *  JSON FORMAT:
 *    ID: Integer,
 *    username: String,
 *    password: String,
 *    email: String,
 *    birthday: Date
 */
app.post('/users', async (req, res) => {
  await Users.findOne({ name: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.name} already exists`);
      }
      else {
        Users.create({
          username: req.body.username,
          password: req.body.password,
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
app.post('/users/:username/favoriteMovies/:title', async (req, res) => {
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
    res.status(201).json(movies);
  })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a movie by title
app.get('/movies/:title', async (req, res) => {
  await Movies.findOne({ title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a director's information by name
app.get('/movies/directors/:name', async (req, res) => {
  await Movies.findOne({ director: req.body.name })
    .then((director) => {
      res.status(201).json({
        name: director.name,
        biography: director.biography,
        birthYear: director.birthYear,
        deathYear: director.deathYear
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send(`Error: ${err}`);
    })
  // const directorName = req.params.name;

  // // Find the directors from each movie
  // const director = movies
  //   .map(movie => movie.directors)
  //   // Flatten the array of directors
  //   .flat()
  //   .find(d => d.name === directorName);
});

// Get a list of users
app.get('/users', async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get a user's information by name
app.get('/users/:username', async (req, res) => {
  await Users.findOne({ username: req.params.username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get genres
app.get('/genres/', async (req, res) => {
  await Genres.find()
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Get genre information by name
app.get('/genres/:name', async (req, res) => {
  await Genres.findOne({ name: req.params.name })
    .then((genre) => {
      res.status(201).json(genre);
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
app.put('/users/:username', async (req, res) => {
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
app.delete('/users/:username', async (req, res) => {
  await Users.findOneAndRemove({ username: req.params.username })
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
    })
});

// Remove a movie from a user's list
app.delete('/users/:username/favoriteMovies/:title', async (req, res) => {
  await Movies.findOneAndRemove({ title: req.params.title })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(`${req.params.title} not found`);
      }
      else {
        res.status(200).send(`${req.params.title} was deleted`);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    })
});


/*  ERROR HANDLING  */
const methodOverride = require('method-override');

// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(methodOverride());

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://${host}:${PORT}`);
});
