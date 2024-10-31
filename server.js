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

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors())
app.use(express.json());

app.use(function (req, res, next) {
  res.locals.errors = [];

  // try to decode incoming cookies
  try {
    const decoded = jwt.verify(req.cookies.ourCurrentUser, process.env.JWTSECRET);
    req.user = decoded;
  } catch (err) {
    req.user = false;
  }
  res.locals.user = req.user;
  // console.log("Hey look i get a user ",req.user);

  next();
});



// endpoint test
app.get("/", (req, res) => {
  res.send({ result: "Request goes through" })
});

app.get("/login/test", (req, res) => {
  res.send({ result: "Login test request works" })
});


const checkUserLoggedIn = (req, res, next) => {
  if (req.user) {
    next(); // User is logged in, proceed to the next middleware or route handler
  } else {
    res.status(401).json({ error: "Unauthorized access." }); // User is not logged in
  }
};


app.get("/movies/all", (req, res) => {
  if (req.user) {
    const postStatement = db.prepare("SELECT * FROM movies LIMIT 50");
    const movies = postStatement.all();
    console.log('Fetched movies from the database:', movies);
    
    return res.send({ movies });
  } else {
    return res.status(401).json({ error: "Unauthorized access." });
  }
});


// use middleware to check user is logged in
app.get("/movies/user/favorites", (req, res) => {
  if (req.user) {
    const postStatement = db.prepare("SELECT * FROM MOVIES JOIN favorites ON favorites.movie_id=movies.id where favorites.user_id=?");
    const movies = postStatement.all(req.user.userid);
     return res.send({ movies });
  } // if (req.user)
res.send({result:"no data"})
 
});




// POST route to add a movie to watch later
app.post("/movies/user/watch-later", (req, res) => {
  const { userId, movieId } = req.body; // Extract user ID and movie ID from the request body

  if (!userId || !movieId) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  const insertWatchLater = db.prepare("INSERT INTO watch_later (user_id, movie_id) VALUES (?, ?);");

  try {
    insertWatchLater.run(userId, movieId);
    res.status(201).json({ message: "Movie added to watch later successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the movie to watch later." });
  }
});


function getUserByUsername(username) {
  const userStatement = db.prepare("SELECT * FROM users WHERE username=?");
  return userStatement.get(username);
}

app.post("/login", [
  body('username').isString().trim().isLength({ min: 5 }).withMessage('Username must be more than 5 letters').matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain letters and numbers'),
  body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
], (req, res) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.array().map(err => err.msg) });
  } // if (!errors.isEmpty())

  const userInQuestion = getUserByUsername(req.body.username);
  if (!userInQuestion) {
    errors = ["Invalid username/password"];
    return res.send({ errors });
  } // if (!userInQuestion)

  const matchOrNot = bcrypt.compareSync(
    req.body.password,
    userInQuestion.password
  );
  if (!matchOrNot) {
    errors = ["Invalid username/password"];
    return res.send({ result: errors });
  } // if (!matchOrNot)

  // give them a cookie
  console.log("Hey react called me............................//////////////////////////''''''''''''''''''''''''''''''''''''''''';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")

  res.cookie("ourCurrentUser", "ourTokenValue", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 3600,
  });

}); // app.post("/login")

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




app.get("/movies/user/favorites", (req, res) => {
  if (req.user) {
    const postStatement = db.prepare("SELECT * FROM MOVIES JOIN favorites ON favorites.movie_id=movies.id where favorites.user_id=?");
    const movies = postStatement.all(req.user.userid);
     return res.send({ movies });
  } // if (req.user)
res.send({result:"no data"})
 
});

app.post("/movies/user/favorites", (req, res) => {
  const { userId, movieId } = req.body; // Extract user ID and movie ID from the request body

  if (!userId || !movieId) {
    return res.status(400).json({ error: "User ID and Movie ID are required." });
  }

  const insertFavorite = db.prepare("INSERT INTO favorites (user_id, movie_id) VALUES (?, ?);");

  try {
    insertFavorite.run(userId, movieId);
    res.status(201).json({ message: "Favorite movie added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the favorite movie." });
  }
});












console.log("###############################################$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&***************************")








 //movies_function.uploadGenres();
//db_function.createTables()
//movies_function.uploadMovies();
//const test_genre= movies_function.createGenreObjects();

//     const moviest=[
//     {
//         "id": 912649,
//         "title": "Venom: The Last Dance",
//         "overview": "Eddie and Venom are on the run. Hunted by both of their worlds and with the net ...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//k42Owka8v91trK1qMYwCQCNwJKr.jpg",
//         "genre": [
//             878,
//             28,
//             12
//         ],
//         "score": 6.6,
//         "release_date": "2024-10-22"
//     },
//     {
//         "id": 1184918,
//         "title": "The Wild Robot",
//         "overview": "After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
//         "genre": [
//             16,
//             878,
//             10751
//         ],
//         "score": 8.583,
//         "release_date": "2024-09-12"
//     },
//     {
//         "id": 1034541,
//         "title": "Terrifier 3",
//         "overview": "Five years after surviving Art the Clown's Halloween massacre, Sienna and Jonath...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//63xYQj1BwRFielxsBDXvHIJyXVm.jpg",
//         "genre": [
//             27,
//             53
//         ],
//         "score": 7.3,
//         "release_date": "2024-10-09"
//     },
//     {
//         "id": 933260,
//         "title": "The Substance",
//         "overview": "A fading celebrity decides to use a black market drug, a cell-replicating substa...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//lqoMzCcZYEFK729d6qzt349fB4o.jpg",
//         "genre": [
//             27,
//             878,
//             53
//         ],
//         "score": 7.3,
//         "release_date": "2024-09-07"
//     },
//     {
//         "id": 1029235,
//         "title": "Azrael",
//         "overview": "In a world where no one speaks, a devout female hunts down a young woman who has...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//qpdFKDvJS7oLKTcBLXOaMwUESbs.jpg",
//         "genre": [
//             28,
//             27,
//             53
//         ],
//         "score": 6.1,
//         "release_date": "2024-09-27"
//     },
//     {
//         "id": 1159311,
//         "title": "僕のヒーローアカデミア THE MOVIE ユアネクスト",
//         "overview": "In a society devastated by the effects of an all-out war between heroes and vill...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//8rdB1wkheEMMqcY8qLAKjCMPcnZ.jpg",
//         "genre": [
//             16,
//             28,
//             12,
//             878
//         ],
//         "score": 6.758,
//         "release_date": "2024-08-02"
//     },
//     {
//         "id": 978796,
//         "title": "Bagman",
//         "overview": "For centuries and across cultures, parents have warned their children of the leg...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//pkKcIP2B2ILAh4lGKyn9YkO0L1t.jpg",
//         "genre": [
//             27,
//             53
//         ],
//         "score": 6.5,
//         "release_date": "2024-09-20"
//     },
//     {
//         "id": 1047373,
//         "title": "The Silent Hour",
//         "overview": "While working a case as an interpreter, a hearing-impaired police detective must...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//j736cRzBtEPCm0nHnpRN1prqiqj.jpg",
//         "genre": [
//             80,
//             53,
//             28
//         ],
//         "score": 6.4,
//         "release_date": "2024-10-03"
//     },
//     {
//         "id": 1100782,
//         "title": "Smile 2",
//         "overview": "About to embark on a new world tour, global pop sensation Skye Riley begins expe...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//aE85MnPIsSoSs3978Noo16BRsKN.jpg",
//         "genre": [
//             27,
//             9648
//         ],
//         "score": 6.889,
//         "release_date": "2024-10-16"
//     },
//     {
//         "id": 823219,
//         "title": "Flow",
//         "overview": "A solitary cat, displaced by a great flood, finds refuge on a boat with various ...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//dzDMewC0Hwv01SROiWgKOi4iOc1.jpg",
//         "genre": [
//             16,
//             14,
//             12
//         ],
//         "score": 8.767,
//         "release_date": "2024-08-30"
//     },
//     {
//         "id": 1249532,
//         "title": "Rippy",
//         "overview": "Young police officer Maddy is determined to live up to her deceased father's leg...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//cZ5U4Ae74g29E02JR5oR98RQhiR.jpg",
//         "genre": [
//             27,
//             9648
//         ],
//         "score": 3.8,
//         "release_date": "2024-10-25"
//     },
//     {
//         "id": 814889,
//         "title": "Never Let Go",
//         "overview": "As an evil takes over the world beyond their front doorstep, the only protection...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//3EpZ2ksjijmdr8BhISP03PYzNFW.jpg",
//         "genre": [
//             27,
//             18
//         ],
//         "score": 6.1,
//         "release_date": "2024-09-18"
//     },
//     {
//         "id": 832964,
//         "title": "Lee",
//         "overview": "The true story of photographer Elizabeth 'Lee' Miller, a fashion model who becam...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//zdNWyuim8gpJHe1LtKaDrs43dWz.jpg",
//         "genre": [
//             18,
//             36,
//             10752
//         ],
//         "score": 6.9,
//         "release_date": "2024-09-12"
//     },
//     {
//         "id": 1064028,
//         "title": "Subservience",
//         "overview": "With his wife out sick, a struggling father brings home a lifelike AI, only to h...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//gBenxR01Uy0Ev9RTIw6dVBPoyQU.jpg",
//         "genre": [
//             878,
//             53,
//             27
//         ],
//         "score": 6.77,
//         "release_date": "2024-08-15"
//     },
//     {
//         "id": 835113,
//         "title": "Woman of the Hour",
//         "overview": "An aspiring actress crosses paths with a prolific serial killer in '70s LA when ...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//nc9ZqrJFbcUdlMg9lxXXtJb24jU.jpg",
//         "genre": [
//             80,
//             18,
//             53
//         ],
//         "score": 6.6,
//         "release_date": "2024-10-03"
//     },
//     {
//         "id": 1084736,
//         "title": "Le Comte de Monte-Cristo",
//         "overview": "Edmond Dantes becomes the target of a sinister plot and is arrested on his weddi...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//sAT1P3FGhtJ68anUyJScnMu8t1l.jpg",
//         "genre": [
//             12,
//             36,
//             28,
//             18,
//             10749,
//             53
//         ],
//         "score": 8.386,
//         "release_date": "2024-06-28"
//     },
//     {
//         "id": 931944,
//         "title": "Des Teufels Bad",
//         "overview": "18th century Austria. Villages surrounded by deep forests. A woman is sentenced ...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//ycoXsJomPmPjtCfNweM0UWiTkPY.jpg",
//         "genre": [
//             27,
//             9648,
//             36
//         ],
//         "score": 7,
//         "release_date": "2024-03-08"
//     },
//     {
//         "id": 1226578,
//         "title": "Longlegs",
//         "overview": "FBI Agent Lee Harker is assigned to an unsolved serial killer case that takes an...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//5aj8vVGFwGVbQQs26ywhg4Zxk2L.jpg",
//         "genre": [
//             27,
//             53
//         ],
//         "score": 6.7,
//         "release_date": "2024-05-31"
//     },
//     {
//         "id": 748230,
//         "title": "Salem's Lot",
//         "overview": "Author Ben Mears returns to his childhood home of Jerusalem's Lot only to discov...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//j7ncdqBVufydVzVtxmXu8Ago4ox.jpg",
//         "genre": [
//             27,
//             9648
//         ],
//         "score": 6.277,
//         "release_date": "2024-10-03"
//     },
//     {
//         "id": 558449,
//         "title": "Gladiator II",
//         "overview": "Years after witnessing the death of the revered hero Maximus at the hands of his...",
//         "poster_url": "https://image.tmdb.org/t/p/w500//2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
//         "genre": [
//             28,
//             12
//         ],
//         "score": 0,
//         "release_date": "2024-11-13"
//     }
// ];


//movies_function.insertGenresForMovies(moviest)


app.listen(4000);
