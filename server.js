require("dotenv").config();

const db_function = require("./database")
const movies_function = require("./helper_function")
const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator')
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const db = require("better-sqlite3")("ourApp.db");
db.pragma("journal_mode = WAL");







const app = express();




// CORS middleware
app.use(
  cors({
    origin: 'http://localhost:5173',  // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  // This is important to allow cookies
  })
);



app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());


app.use(function (req, res, next) {
  res.locals.errors = [];

  // Try to decode incoming cookies
  try {
    const decoded = jwt.verify(req.cookies.ourCurrentUser, process.env.JWTSECRET);
    req.user = decoded;
  } catch (err) {
 //   console.error("Error verifying JWT:", err);
    req.user = false;
  }

  res.locals.user = req.user;
  next();
});



// endpoint test
app.get("/", (req, res) => {
   res.send({ result: "Get Request goes through" })
});


const checkUserLoggedIn = (req, res, next) => {
  if (req.user) {
     
    next(); // User is logged in, proceed
    } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
};




function getUserByUsername(username) {
  const userStatement = db.prepare("SELECT * FROM users WHERE username=?");
  return userStatement.get(username);
}










app.post("/login", [
  body('username').isString().trim().isLength({ min: 5 }).withMessage('Username must be more than 5 letters').matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain letters and numbers'),
  body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.array().map(err => err.msg) });
  }
  const userInQuestion = await getUserByUsername(req.body.username);
  if (!userInQuestion) {
    errors = ["Invalid username/password"];
    return res.send({ errors });
  }

  bcrypt.compare(req.body.password, userInQuestion.password, (err, matchOrNot) => {
    if (err) {
      console.error("Error comparing password:", err);
      return res.status(500).send({ error: 'Internal Server Error' });
    }

    if (!matchOrNot) {
      errors = ["Invalid username/password"];
      return res.send({ result: errors });
    }

  const ourTokenValue = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 3600,
      skycolor: "blue",
      userid: userInQuestion.id,
      username: userInQuestion.username,
    },
   process.env.JWTSECRET
  );

    res.cookie("ourCurrentUser", ourTokenValue, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600 * 1000
  });

  const postStatement = db.prepare("SELECT * FROM movies LIMIT 50");
    const moviesList = postStatement.all();
    const userMoviesData={
  movies: moviesList.slice(0,6),
  favorites: moviesList.slice(7,13),
  watchLater:moviesList.slice(14,19)
}

    // Proceed with your login logic here (e.g., setting a cookie)
    return res.send({ userMoviesData });


    
  });
});




app.post("/register", [
  body('username').isString().trim().isLength({ min: 5 }).withMessage('Username must be more than 5 letters').matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain letters and numbers'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
], (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.array().map(err => err.msg) });
  } // if (!errors.isEmpty())

  const userInQuestion = getUserByUsername(req.body.username);
  if (userInQuestion) {
    errors.push("User already exists");
  } // if (userInQuestion)

  if (errors.length) {
    return res.send({ errors });
  } // if (errors.length)

  // save the new user into the database
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  const ourStatement = db.prepare(
    "INSERT INTO users (username ,email, password) VALUES (?, ?,?)"
  );
  const result = ourStatement.run(req.body.username, req.body.email, req.body.password);
}); // app.post("/register")



// GET route to get watch later
app.get("/movies/user/watch-later",checkUserLoggedIn, (req, res) => {
  const { movie_id } = req.body; // Extract user ID and movie ID from the request body

  const insertWatchLater = db.prepare("SELECT movies.* FROM movies JOIN watch_later ON watch_later.movie_id = movies.id WHERE watch_later.user_id = ?");

  try {
   const movies= insertWatchLater.all(req.user.userid);
    return res.send({ movies});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the watch later." });
  }
});


// POST route to add a movie to watch later
app.post("/movies/user/watch-later",checkUserLoggedIn, (req, res) => {
  const {movie_id } = req.body; // Extract user ID and movie ID from the request body
  const insertWatchLater = db.prepare("INSERT INTO watch_later (user_id, movie_id) VALUES (?, ?);");
  if (!movie_id) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }
  try {
    insertWatchLater.run(req.user.userid, movie_id);
    res.status(201).json({ message: "Movie added to watch later successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the movie to watch later." });
  }
});



app.delete("/movies/user/watch-later/delete",checkUserLoggedIn, (req, res) => {
  const {movie_id } = req.body; // Extract user ID and movie ID from the request body

  if (!movie_id) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  const insertFavorite = db.prepare("DELETE FROM watch_later WHERE user_id=? AND movie_id=?;");

  try {
    insertFavorite.run(req.user.userid, movie_id);
    res.status(201).json({ message: "Watch-later movie removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the favorite movie." });
  }
  
});



app.get("/movies/user/favorites",checkUserLoggedIn, (req, res) => {
  try {
    const postStatement = db.prepare("SELECT movies.* FROM movies JOIN favorites ON favorites.movie_id = movies.id WHERE favorites.user_id = ?");
    const movies = postStatement.all(2); // Change 1 to req.user.userid if needed
    return res.send({ movies });
  } catch (error) {
    console.error("Database query error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});



app.post("/movies/user/favorites",checkUserLoggedIn, (req, res) => {
  const {movie_id } = req.body; // Extract user ID and movie ID from the request body

  if (!movie_id) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  const insertFavorite = db.prepare("INSERT INTO favorites (user_id, movie_id) VALUES (?, ?);");

  try {
    insertFavorite.run(req.user.userid, movie_id);
    res.status(201).json({ message: "Favorite movie added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the favorite movie." });
  }
});


app.delete("/movies/user/favorites/delete",checkUserLoggedIn, (req, res) => {
  const {movie_id } = req.body; // Extract user ID and movie ID from the request body

  if (!movie_id) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  const insertFavorite = db.prepare("DELETE FROM favorites WHERE user_id=? AND movie_id=?;");

  try {
    insertFavorite.run(req.user.userid, movie_id);
    res.status(201).json({ message: "Favorite movie removed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the favorite movie." });
  }

});




 //movies_function.uploadGenres();
//db_function.createTables()
//movies_function.uploadMovies();
//const test_genre= movies_function.createGenreObjects();
//movies_function.insertGenresForMovies(moviest)


app.listen(4000);
