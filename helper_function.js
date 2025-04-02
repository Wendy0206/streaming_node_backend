// Function to upload movies into the database
const db = require("better-sqlite3")("ourApp.db");
db.pragma("journal_mode = WAL");


const uploadGenres = () => {
  // Prepare the insert statement
  const genres = [
    { name: "Action", id: 28 },
    { name: "Adventure", id: 12 },
    { name: "Animation", id: 16 },
    { name: "Comedy", id: 35 },
    { name: "Crime", id: 80 },
    { name: "Documentary", id: 99 },
    { name: "Drama", id: 18 },
    { name: "Family", id: 10751 },
    { name: "Fantasy", id: 14 },
    { name: "History", id: 36 },
    { name: "Horror", id: 27 },
    { name: "Music", id: 10402 },
    { name: "Mystery", id: 9648 },
    { name: "Romance", id: 10749 },
    { name: "Sci-Fi", id: 878 },
    { name: "TV movie", id: 10770 },
    { name: "Thriller", id: 53 },
    { name: "War", id: 10752 },
    { name: "Western", id: 37 }
  ];
  const insertStatement = db.prepare("INSERT INTO genre (name, id) VALUES (?,?)");

  genres.forEach((genre) => {
    try {
      insertStatement.run(genre.name, genre.id); // Assuming each genre object has a 'name' property
    } catch (error) {
      console.error(`Error inserting genre ${genre.name}:`, error.message);
    }
  });

  console.log("Genres uploaded successfully.");
};




function uploadMovies() {
const movies= [
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

  const insertStatement = db.prepare(`
    INSERT INTO movies (title, poster_url, duration, overview, release_date, score) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Insert each movie into the database
  movies.forEach((movie) => {
    insertStatement.run(
      movie.title,
      movie.poster_url,
      movie.duration,
      movie.overview,
      movie.release_date,
      movie.score
    );
  });
}




const insertGenresForMovies = (movies) => {
  const getMovieId = db.prepare("SELECT id FROM movies WHERE title = ?");
  const insertGenreMovie = db.prepare("INSERT INTO genre_movie (movie_id, genre_id) VALUES (?, ?)");

  // Transaction to insert genres for each movie
  const insertGenresForMovie = db.transaction((movie) => {
    const movieId = getMovieId.get(movie.title)?.id;
    if (movieId) {
      movie.genre.forEach((genreId) => {
        insertGenreMovie.run(movieId, genreId);
      });
    } else {
      console.error(`Movie with title "${movie.title}" not found.`);
    }
  });

  // Process each movie
  movies.forEach(movie => {
    insertGenresForMovie(movie);
  });
};


const moviesAll= [
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


const getUserMoviesList=(userid)=>{

    // SQL queries for both watch-later and favorites
  const getWatchLater = db.prepare(`
    SELECT movies.* 
    FROM movies 
    JOIN watch_later ON watch_later.movie_id = movies.id 
    WHERE watch_later.user_id = ?
  `);

  const getFavorites = db.prepare(`
    SELECT movies.* 
    FROM movies 
    JOIN favorites ON favorites.movie_id = movies.id 
    WHERE favorites.user_id = ?
  `);

 const getMovies = db.prepare("SELECT * FROM movies LIMIT 30");
  
   try {
    // Fetch both lists
    const watchLaterMovies = getWatchLater.all(userid);
    const favoriteMovies = getFavorites.all(userid);
    const userMovies = getMovies.all();

    // Send both lists in a single object
    return {
      watchLater: watchLaterMovies,
      favorites: favoriteMovies,
      movies: userMovies
    };

  } catch (error) {
    console.error(error);
    }

};



const getMoviesList=()=>{

    // SQL queries for both watch-later and favorites
 
 const getMovies = db.prepare("SELECT * FROM movies limit 15");
  
   try {
    // Fetch both lists
   
    const allMovies = getMovies.all();

    // Send both lists in a single object
    return {
      movies: allMovies
    };

  } catch (error) {
    console.error(error);
    }

};




module.exports = { uploadMovies, uploadGenres, insertGenresForMovies, getUserMoviesList, getMoviesList };


