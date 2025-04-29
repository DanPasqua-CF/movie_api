const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models;')
const uuid = require('uuid');
const bodyParser = require('body-parser');

const Movies = Models.Movie;
const Users = Models.User;

// app.use()
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('dev'));

/* Environment */
const host = '127.0.0.1';
const PORT = 8080;

mongoose.connect(`mongodb://${host}:27017/myFlix`, { userNewUrlParser: true, useUnifiedTopology: true });

const genres = [
  {
    name: "action",
    description: "In an action story, the protagonist usually takes a risky turn, which leads to desperate situations, including explosions, fight scenes, daring escapes, etc."
  },
  {
    name: "comedy",
    description: "Comedy is a story that tells about a series of funny, or comical events, intended to make the audience laugh."
  },
  {
    name: "crime",
    description: "A crime story is often about a crime that is being committed or was committed, but can also be an account of a criminal's life."
  },
  {
    name: "drama",
    description: "A dramatic story intended to be more serious than humorous in tone, focusing on in-depth development of realistic characters who must deal with realistic emotional struggles."
  },
  {
    name: "fantasy",
    description: "A fantasy story is about magic or supernatural forces, as opposed to technology as seen in science fiction."
  },
  {
    name: "horror",
    description: "A horror story is told to deliberately scare or frighten the audience, through suspense, violence or shock."
  },
  {
    name: "science fiction",
    description: "Science fiction stories use scientific understanding to explain the universe that it takes place in."
  }
];

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
app.post('/users/:username/favoriteMovies/:movieId', async (req, res) => {
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
    })
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
      res.json(movie)
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    })
});

// Get a director's information by name
app.get('/movies/directors/:name', (req, res) => {
  const directorName = req.params.name;

  // Find the directors from each movie
  const director = movies
    .map(movie => movie.directors)
    // Flatten the array of directors
    .flat()
    .find(d => d.name === directorName);

  if (director) {
    // Return the director's information if found
    res.json({
      name: director.name,
      biography: director.biography,
      birthYear: director.birthYear,
      deathYear: director.deathYear
    });
  }
  else {
    // Return a 404 error if the director is not found
    res.status(404).json({ error: "Director not found" });
  }
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
app.get('/users/:name', async (req, res) => {
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
app.get('/genres/', (req, res) => {
  res.json(genres);
});

// Get genre information by name
app.get('/genres/:name', (req, res) => {
  res.json(genres.find((genre) => {
    return genre.name === req.params.name;
  }));
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
app.delete('/users/:username', async (req, res) => {
  let deletedMovie = req.body.favoriteMovies;

  res.status(200).send({
    message: 'Movie deleted'
  })
});

// Remove a user by ID
app.delete('/users/:id', (req, res) => {
  let user = req.body.name;

  res.status(201).send({
    message: 'User deleted'
  });
});

/*  ERROR HANDLING  */
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(8080, () => {
  console.log(`Server running at http://${host}:${PORT}`);
});
