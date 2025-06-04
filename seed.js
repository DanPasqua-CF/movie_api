require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;


const mongoUri = process.env.MONGODB_URI;

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing collections before seeding (optional)
    await Movies.deleteMany({});
    await Genres.deleteMany({});
    await Users.deleteMany({});

    // Read and parse JSON files
    const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf-8'));
    const genresData = JSON.parse(fs.readFileSync(path.join(__dirname, 'genres.json'), 'utf-8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));

    // Insert genres
    await Genres.insertMany(genresData);
    console.log(`Inserted ${genresData.length} genres`);

    // Insert movies
    await Movies.insertMany(moviesData);
    console.log(`Inserted ${moviesData.length} movies`);

    // Insert users
    await Users.insertMany(usersData);
    console.log(`Inserted ${usersData.length} users`);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedData();
