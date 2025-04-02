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
const port = process.env.PORT || 3000;






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
   res.send({ result: "Welcome to our streaming backend" })
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
  body('username').isString().trim().isLength({ min: 5 }).withMessage('Username must be more than 5 letters').matches(/^[a-zA-Z0-9]+$/)
  .withMessage('Username can only contain letters and numbers'),
  body('password').isString().trim().isLength({ min: 6 }).withMessage('Password must have at least 6 characters')
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({ errors: errors.array().map(err => err.msg) });
  }
  const userInQuestion = await getUserByUsername(req.body.username);
  if (!userInQuestion) {
    errors = ["Invalid username/password"];
    return res.status(401).send.send({ errors });
  }

  bcrypt.compare(req.body.password, userInQuestion.password, (err, matchOrNot) => {
    if (err) {
      console.error("Error comparing password:", err);
      return res.status(500).send({ error: 'Internal Server Error' });
    }

    if (!matchOrNot) {
      errors = ["Invalid username/password"];
      return res.status(403).send({ result: errors });
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



    // Proceed with your login logic here (e.g., setting a cookie)
   res.status(200).send({ message: 'Ok' });


    
  });
});


// const test2= movies_function.getUserMoviesList(req.user.userid)
// console.log("this is our test ", test2)



app.get("/user/movies/all",checkUserLoggedIn, async (req, res) => {
const userMoviesData = movies_function.getUserMoviesList( req.user.userid);
     return res.send({userMoviesData});
});

app.get("/movies/all",async (req, res) => {
const userMoviesData = movies_function.getMoviesList( req.user.userid);
     return res.send({userMoviesData});
});

// POST route to add/remove a movie to watch later
app.post("/movies/user/watch-later", checkUserLoggedIn, (req, res) => {
  const { movie_id } = req.body; // Extract user ID and movie ID from the request body

  if (!movie_id) {
    return res.status(400).json({ error: "Movie ID is required." });
  }

  // Check if the movie is already in the watch_later table
  const checkMovieExists = db.prepare("SELECT 1 FROM watch_later WHERE user_id = ? AND movie_id = ?;");
  const existingMovie = checkMovieExists.get(req.user.userid, movie_id);

  if (existingMovie) {
    // Movie exists, so we remove it (delete from watch later)
    const deleteWatchLater = db.prepare("DELETE FROM watch_later WHERE user_id = ? AND movie_id = ?");
    try {
      deleteWatchLater.run(req.user.userid, movie_id);
      res.status(200).json({ message: "Movie removed from watch later successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while removing the movie from watch later." });
    }
  } else {
    // Movie does not exist, so we add it (insert into watch later)
    const insertWatchLater = db.prepare("INSERT INTO watch_later (user_id, movie_id) VALUES (?, ?);");
    try {
      insertWatchLater.run(req.user.userid, movie_id);
      res.status(201).json({ message: "Movie added to watch later successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while adding the movie to watch later." });
    }
  }
});



app.post("/movies/user/favorites", checkUserLoggedIn, (req, res) => {
  const { movie_id } = req.body; // Extract user ID and movie ID from the request body

  if (!movie_id) {
    return res.status(400).json({ error: "Movie ID is required." });
  }

  // Check if the movie is already in the favorites table
  const checkMovieExists = db.prepare("SELECT 1 FROM favorites WHERE user_id = ? AND movie_id = ?;");
  const existingMovie = checkMovieExists.get(req.user.userid, movie_id);

  if (existingMovie) {
    // Movie exists, so we remove it (delete from favorites)
    const deleteFavorite = db.prepare("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?");
    try {
      deleteFavorite.run(req.user.userid, movie_id);
      res.status(200).json({ message: "Favorite movie removed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while removing the movie from favorites." });
    }
  } else {
    // Movie does not exist, so we add it (insert into favorites)
    const insertFavorite = db.prepare("INSERT INTO favorites (user_id, movie_id) VALUES (?, ?);");
    try {
      insertFavorite.run(req.user.userid, movie_id);
      res.status(201).json({ message: "Favorite movie added successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while adding the movie to favorites." });
    }
  }
});



const moviest= [
    {
        "id": 1034541,
        "title": "Terrifier 3",
        "overview": "Five years after surviving Art the Clown's Halloween massacre, Sienna and Jonathan are still struggl...",
        "poster_url": "https://image.tmdb.org/t/p/w500//l1175hgL5DoXnqeZQCcU3eZIdhX.jpg",
        "genre": [
            27,
            53,
            9648
        ],
        "score": 6.931,
        "release_date": "2024-10-09"
    },
    {
        "id": 402431,
        "title": "Wicked",
        "overview": "Elphaba, a young woman misunderstood because of her green skin, and Glinda, a popular aristocrat gil...",
        "poster_url": "https://image.tmdb.org/t/p/w500//c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg",
        "genre": [
            18,
            14,
            10749
        ],
        "score": 7.9,
        "release_date": "2024-11-20"
    },
    {
        "id": 933260,
        "title": "The Substance",
        "overview": "A fading celebrity decides to use a black market drug, a cell-replicating substance that temporarily...",
        "poster_url": "https://image.tmdb.org/t/p/w500//lqoMzCcZYEFK729d6qzt349fB4o.jpg",
        "genre": [
            18,
            27,
            878
        ],
        "score": 7.3,
        "release_date": "2024-09-07"
    },
    {
        "id": 1241982,
        "title": "Moana 2",
        "overview": "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and ...",
        "poster_url": "https://image.tmdb.org/t/p/w500//m0SbwFNCa9epW1X60deLqTHiP7x.jpg",
        "genre": [
            16,
            12,
            10751,
            35
        ],
        "score": 7.4,
        "release_date": "2024-11-27"
    },
    {
        "id": 1124641,
        "title": "Classified",
        "overview": "Operating alone in the field for more than 20 years, a CIA hitman uses the \"Help Wanted\" section of ...",
        "poster_url": "https://image.tmdb.org/t/p/w500//3k8jv1kSAAc0rCfFGtWDDQL4dfK.jpg",
        "genre": [
            28,
            53
        ],
        "score": 5.6,
        "release_date": "2024-09-19"
    },
    {
        "id": 845781,
        "title": "Red One",
        "overview": "After Santa Claus (codename: Red One) is kidnapped, the North Pole's Head of Security must team up w...",
        "poster_url": "https://image.tmdb.org/t/p/w500//cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
        "genre": [
            28,
            35,
            14
        ],
        "score": 6.615,
        "release_date": "2024-10-31"
    },
    {
        "id": 1014505,
        "title": "劇場版「オーバーロード」聖王国編",
        "overview": "After twelve years of playing his favorite MMORPG game, Momonga logs in for the last time only to fi...",
        "poster_url": "https://image.tmdb.org/t/p/w500//jEvytxNa5mfW7VAUmDWsZtIdATc.jpg",
        "genre": [
            28,
            12,
            16,
            14
        ],
        "score": 7.7,
        "release_date": "2024-09-20"
    },
    {
        "id": 1084736,
        "title": "Le Comte de Monte-Cristo",
        "overview": "Edmond Dantes becomes the target of a sinister plot and is arrested on his wedding day for a crime h...",
        "poster_url": "https://image.tmdb.org/t/p/w500//zw4kV7npGtaqvUxvJE9IdqdFsNc.jpg",
        "genre": [
            28,
            12,
            18,
            36,
            10749,
            53
        ],
        "score": 8.227,
        "release_date": "2024-06-28"
    },
    {
        "id": 823219,
        "title": "Straume",
        "overview": "A solitary cat, displaced by a great flood, finds refuge on a boat with various species and must nav...",
        "poster_url": "https://image.tmdb.org/t/p/w500//dzDMewC0Hwv01SROiWgKOi4iOc1.jpg",
        "genre": [
            16,
            14,
            12
        ],
        "score": 8.5,
        "release_date": "2024-08-29"
    },
    {
        "id": 957452,
        "title": "The Crow",
        "overview": "Soulmates Eric and Shelly are brutally murdered when the demons of her dark past catch up with them....",
        "poster_url": "https://image.tmdb.org/t/p/w500//58QT4cPJ2u2TqWZkterDq9q4yxQ.jpg",
        "genre": [
            28,
            14,
            27
        ],
        "score": 5.9,
        "release_date": "2024-08-21"
    },
    {
        "id": 978796,
        "title": "Bagman",
        "overview": "For centuries and across cultures, parents have warned their children of the legendary Bagman, who s...",
        "poster_url": "https://image.tmdb.org/t/p/w500//hzrvol8K2VWm2BsDTwb8YvRMzIH.jpg",
        "genre": [
            27,
            53
        ],
        "score": 6.259,
        "release_date": "2024-09-20"
    },
    {
        "id": 592831,
        "title": "Megalopolis",
        "overview": "Genius artist Cesar Catilina seeks to leap the City of New Rome into a utopian, idealistic future, w...",
        "poster_url": "https://image.tmdb.org/t/p/w500//8Sok3HNA3r1GHnK2lCytHyBz1A.jpg",
        "genre": [
            18,
            878
        ],
        "score": 5.6,
        "release_date": "2024-09-25"
    },
    {
        "id": 1100099,
        "title": "We Live in Time",
        "overview": "An up-and-coming chef and a recent divorcée find their lives forever changed when a chance encounter...",
        "poster_url": "https://image.tmdb.org/t/p/w500//oeDNBgnlGF6rnyX1P1K8Vl2f3lW.jpg",
        "genre": [
            10749,
            18,
            35
        ],
        "score": 7.7,
        "release_date": "2024-10-10"
    },
    {
        "id": 1064028,
        "title": "Subservience",
        "overview": "With his wife out sick, a struggling father brings home a lifelike AI, only to have his self-aware n...",
        "poster_url": "https://image.tmdb.org/t/p/w500//gBenxR01Uy0Ev9RTIw6dVBPoyQU.jpg",
        "genre": [
            878,
            53,
            27
        ],
        "score": 6.7,
        "release_date": "2024-08-15"
    },
    {
        "id": 814889,
        "title": "Never Let Go",
        "overview": "As an evil takes over the world beyond their front doorstep, the only protection for a mother and he...",
        "poster_url": "https://image.tmdb.org/t/p/w500//3EpZ2ksjijmdr8BhISP03PYzNFW.jpg",
        "genre": [
            27,
            18
        ],
        "score": 6.3,
        "release_date": "2024-09-18"
    },
    {
        "id": 1114513,
        "title": "Speak No Evil",
        "overview": "When an American family is invited to spend the weekend at the idyllic country estate of a charming ...",
        "poster_url": "https://image.tmdb.org/t/p/w500//fDtkrO2OAF8LKQTdzYmu1Y7lCLB.jpg",
        "genre": [
            27,
            53
        ],
        "score": 7.4,
        "release_date": "2024-09-11"
    },
    {
        "id": 1292359,
        "title": "Hello, Love, Again",
        "overview": "Five years on from when Joy said goodbye to Ethan and Hong Kong to pursue her dreams in Canada. Afte...",
        "poster_url": "https://image.tmdb.org/t/p/w500//7R940b9RNNKLDrAI1GmCjOd5ta.jpg",
        "genre": [
            10749,
            18
        ],
        "score": 5.7,
        "release_date": "2024-11-13"
    },
    {
        "id": 1079485,
        "title": "Winnie-the-Pooh: Blood and Honey 2",
        "overview": "Five months following the murders, Christopher Robin struggles to maintain a regular life while deal...",
        "poster_url": "https://image.tmdb.org/t/p/w500//2sADrLwMQof6yYmrJRSa04tFZuS.jpg",
        "genre": [
            27,
            53
        ],
        "score": 6.196,
        "release_date": "2024-03-26"
    },
    {
        "id": 1047373,
        "title": "The Silent Hour",
        "overview": "While working a case as an interpreter, a hearing-impaired police detective must confront a group of...",
        "poster_url": "https://image.tmdb.org/t/p/w500//j736cRzBtEPCm0nHnpRN1prqiqj.jpg",
        "genre": [
            80,
            53,
            28
        ],
        "score": 6.468,
        "release_date": "2024-10-03"
    },
    {
        "id": 1087822,
        "title": "Hellboy: The Crooked Man",
        "overview": "Hellboy and a rookie BPRD agent get stranded in 1950s rural Appalachia. There, they discover a small...",
        "poster_url": "https://image.tmdb.org/t/p/w500//iz2GabtToVB05gLTVSH7ZvFtsMM.jpg",
        "genre": [
            14,
            27,
            28
        ],
        "score": 5.333,
        "release_date": "2024-08-29"
    }
]

 //movies_function.uploadGenres();
//db_function.createTables()
//movies_function.uploadMovies();
//const test_genre= movies_function.createGenreObjects();
movies_function.insertGenresForMovies(moviest)


app.listen(port);
