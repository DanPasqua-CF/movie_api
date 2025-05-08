const mongoose = require('mongoose');

/*  Director schema  */
const directorSchema = new mongoose.Schema({
  name: String,
  biography: String,
  birthYear: Date,
  deathYear: Date
});

/*  Movie schema  */
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  description: { type: String, required: true },
  directors: [ directorSchema ],
  imageUrl: String,
  featured: Boolean
});

/*  User schema  */
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/*  Genre schema  */
let genreSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
})

let Movie = mongoose.model('movies', movieSchema);
let User = mongoose.model('users', userSchema);
let Genre = mongoose.model('genres', genreSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
