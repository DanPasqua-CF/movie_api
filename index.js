const express = require('express');
const morgan = require('morgan');
const app = express();

// app.use()
app.use(express.static('public'));
app.use(morgan('common'));

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

app.listen(8080, () => {
  console.log('Listening on port 8080.')
});
