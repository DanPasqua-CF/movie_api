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

const movies = [
  {
    title: "Airplane!",
    genre: [
      "comedy"
    ],
    description: "After the crew becomes sick with food poisoning, a neurotic ex-fighter pilot must safely land a commercial airplane full of passengers.",
    directors: [
      {
        name: "Jim Abrahams",
        biography: "Jim Abrahams was born in Shorewood, Wisconsin.",
        birthYear: 1944,
        deathYear: 2024
      },
      {
        name: "David Zucker",
        biography: "David Zucker was born on October 16, 1947 in Milwaukee, Wisconsin.",
        birthYear: 1947,
        deathYear: null
      },
      {
        name: "Jerry Zucker",
        biography: "Jerry Zucker was born in Milwaukee, Wisconsin",
        birthYear: 1950,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Goodfellas",
    description: "The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito.",
    genre: [
      "crime"
    ],
    directors: [
      {
        name: "Martin Scorsese",
        biography: "Martin Charles Scorsese was born in Queens, New York City.",
        birthYear: 1942,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Goodwill Hunting",
    genre: [
      "drama"
    ],
    description: "Will Hunting, a janitor at MIT, has a gift for mathematics, but needs help from a psychologist to find direction in his life.",
    directors: [
      {
        name: "Gus Van Sant",
        biography: "Gus Green Van Sant Jr. is an American filmmaker from Louisville, Kentucky.",
        birthYear: 1952,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 1",
    genre: [
      "fantasy"
    ],
    description: "Harry Potter is tasked with the dangerous and seemingly impossible task of locating and destroying Voldemort's remaining Horcruxes.",
    directors: [
      {
        name: "David Yates",
        biography: "David Yates was born in St. Helens, Merseyside, England, UK.",
        birthYear: 1963,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 2",
    genre: [
      "fantasy"
    ],
    description: "As the battle between the forces of good and evil in the wizarding world escalates, Harry Potter draws ever closer to his final confrontation with Voldemort.",
    directors: [
      {
        name: "David Yates",
        biography: "David Yates was born on October 8, 1963 in St. Helens, Merseyside, England, UK.",
        birthYear: 1963,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Shawshank Redemption",
    genre: [
      "drama"
    ],
    description: "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
    directors: [
      {
        name: "Frank Darabont",
        biography: "Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France.",
        birthYear: 1959,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Silence of the Lambs",
    genre: [
      "crime",
      "drama"
    ],
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.",
    directors: [
      {
        name: "Jonathan Demme",
        biography: "Jonathan Demme was born in Long Island, New York.",
        birthYear: 1944,
        deathYear: 2017
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "Step Brothers",
    genre: [
      "comedy"
    ],
    description: "Two aimless middle-aged losers still living at home are forced against their will to become roommates when their parents marry.",
    directors: {
      name: "Adam McKay",
      biography: "Adam McKay is an American screenwriter, director, comedian, and actor.",
      birthYear: 1968,
      deathYear: null
    },
    imageUrl: "",
    featured: true
  },
  {
    title: "The Sandlot",
    genre: [
      "comedy",
      "drama"
    ],
    description: "In the summer of 1962, a new kid in town is taken under the wing of a young baseball prodigy and his rowdy team, resulting in many adventures.",
    directors: [
      {
        name: "David Mickey Evans",
        biography: "David Mickey Evans was born in Wilkes Barre, Pennsylvania.",
        birthYear: 1962,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  },
  {
    title: "The Town",
    genre: [
      "crime",
      "drama"
    ],
    description: "A proficient group of thieves rob a bank and hold the manager hostage. Things get complicated when one of the crew members falls in love with her.",
    directors: [
      {
        name: "Ben Affleck",
        biography: "Benjamin Affleck was born in Berkeley, California.",
        birthYear: 1972,
        deathYear: null
      }
    ],
    imageUrl: "",
    featured: true
  }
];

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
  await Users.findOne({ name: req.body.name })
    .then((user) => {
      if (user) {
        return res.status(400).send(`${req.body.name} already exists`);
      }
      else {
        Users
          .create({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send(`Error: ${error}`);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error: ${error}`);
    })
});

// Add a new movie to a user's list
app.post('/users/:id/favoriteMovies', (req, res) => {
  let newMovie = req.body.favoriteMovies;

  // TODO: Wait for further instruction
  // user.favoriteMovies.push(newMovie);
  res.status(201).send({
    message: `Movie added`
  });
});


/*  READ  */
// Get a list of all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Get a movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title;
  }));
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
    })
});

// Get a user's information by name
app.get('/users/:name', async (req, res) => {
  await Users.findOne({ username: req.params.name })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    })
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
// Update user's name by ID
app.put('/users/:id/name', (req, res) => {
  const updatedUser = req.body.name;

  res.status(201).send({
    message: 'Name updated'
  });
});

// Update user's isActive status
app.put('/users/:id/isActive', (req, res) => {
  const updatedUser = req.body.isActive;

  res.status(201).send({
    message: 'Status updated'
  });
});


/*  DELETE  */
// Remove a movie from a user's list
app.delete('/users/:id/favoriteMovies', (req, res) => {
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
