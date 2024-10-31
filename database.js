const db = require("better-sqlite3")("ourApp.db");
db.pragma("journal_mode = WAL");

//database setup
const createTables = db.transaction(() => {
  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS users(
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL)`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS movies(
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL ,
     poster_url TEXT ,
     duration  FLOAT ,
    overview TEXT NOT NULL,
       release_date TEXT NOT NULL,
     score INTEGER NOT NULL)`
  ).run();

  db.prepare(
    ` CREATE TABLE IF NOT EXISTS genre(
   id INTEGER PRIMARY KEY, 
    name TEXT NOT NULL UNIQUE)`
  ).run();

  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS favorites(
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
   movie_id INTEGER NOT NULL,
   user_id INTEGER NOT NULL,
   FOREIGN KEY (movie_id) REFERENCES movies (id),
    FOREIGN KEY (user_id) REFERENCES users (id))`
  ).run();

  db.prepare(
    `CREATE TABLE IF NOT EXISTS genre_movie(
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
    movie_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
     FOREIGN KEY (movie_id) REFERENCES movies (id),
      FOREIGN KEY (genre_id) REFERENCES genre (id))`
  ).run();

  db.prepare(
    ` CREATE TABLE IF NOT EXISTS watch_later(
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
    movie_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (movie_id) REFERENCES movies (id))`
  ).run();
});

module.exports = { createTables };
