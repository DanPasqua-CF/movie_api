const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/*  Director schema  */
const directorSchema = new mongoose.Schema({
  name: String,
  biography: String,
  birthYear: Date,
  deathYear: Date
});

/*  Genre schema  */
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String
});

/*  Movie schema  */
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  description: { type: String, required: true },
  directors: [directorSchema],
  imageUrl: String,
  featured: Boolean
});

/*  User schema  */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/* Model registration (fixed names) */
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Movie, User, Genre };
