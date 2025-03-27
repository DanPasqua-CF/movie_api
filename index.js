const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

/* Environment */
const host = '127.0.0.1';
const PORT = 8080;

// app.use()
app.use(express.static('public'));
app.use(morgan('dev'));

const bestMovies = [
  {
    title: "Airplane!"
  },
  {
    title: "Goodfellas"
  },
  {
    title: "Goodwill Hunting"
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 1"
  },
  {
    title: "Harry Potter and the Deathly Hallows: Part 2"
  },
  {
    title: "Shawshank Redemption"
  },
  {
    title: "Silence of the Lambs"
  },
  {
    title: "Step Brothers"
  },
  {
    title: "The Sandlot"
  },
  {
    title: "The Town"
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Check out some awesome movies');
});

app.get('/movies', (req, res) => {
  res.json(bestMovies);
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

// app.get('/test-error', (req, res, next) => {
//   try {
//     throw new Error('Error handling works');
//   } catch (error) {
//     next(error);
//   }
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('This should not be happening!');
// });

app.get('*', (req, res) => {
  res.status(404).send('Error 404: Page not found');
});

app.listen(8080, () => {
  console.log(`Server running at http://${host}:${PORT}`);
});
