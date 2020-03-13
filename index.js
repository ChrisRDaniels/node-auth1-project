const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
// this is just immediately calling the imported function with `session` as a parameter
const KnexSessionStore = require("connect-session-knex")(session);
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const dbConfig = require("./data/dbconfig");

const server = express();
const port = process.env.PORT || 5500;

server.use(cors());
server.use(helmet());
server.use(morgan("short"));
server.use(express.json());
server.use(
 session({
  name: "token", // overwrites the default cookie name, hides our stack better
  resave: false, // avoid recreating sessions that have not changes
  saveUninitialized: false, // GDPR laws against setting cookies automatically
  secret: process.env.COOKIE_SECRET || "secret", // cryptographically sign the cookie
  cookie: {
   maxAge: 1000 * 60 * 10, // expire the cookie after 2 minutes
   httpOnly: true // disallow javascript from reading our cookie contents
  },
  store: new KnexSessionStore({
   knex: dbConfig,
   clearInterval: 1000 * 60 * 5, //  delete expired sessions every five minutes
   createtable: true // if the session table doesn't exist, create it automatically
  })
 })
);

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res, next) => {
 res.json({
  message: "Welcome to our API"
 });
});

server.use((err, req, res, next) => {
 console.log(err);
 res.status(500).json({
  message: "Something went wrong"
 });
});

server.listen(port, () => {
 console.log(`Running at http://localhost:${port}`);
});
