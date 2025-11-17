# Introduction
This application contains the APIs to run the myFlix Client application.

## API endpoints

### CREATE
`/users` -- Add a new user
`/users/:username/favoriteMovies/:movieId` -- Add a new movie to a user's favorites list

### READ
`/movies` -- Get a list of available movies  
`/movies/:title` -- Get a movie by its title  
`/movies/directors/:name` -- Get a director's information by name  
`/users` -- Get a list of users  
`/users/:username` -- Get a uer's information by name  
`/genres` -- Get a list of genres  
`/genres/:name` -- Get information about a specific genre  

### UPDATE
`/users/:username` -- Update a user's information

### DELETE
`/users/:username` -- Delete a user's profile  
`/users/:username/favoriteMovies/:movieId` -- Delete a movie from a user's favorites list

## Technologies
- JavaScript
- HTML
- CSS
- Express
- Passport
- Mongoose
