const mongoose = require('mongoose');

/*  Movie schema  */
let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: [String],
  directors: [{
    name: String,
    biography: String,
    birthYear: Date,
    deathYear: Date
  }],
  imageUrl: String,
  featured: Boolean
});

/*  User schema  */
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: Movie }]
});

let Movie = mongoose.model('movies', movieSchema);
let User = mongoose.model('users', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
