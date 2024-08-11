//express library
const express = require("express");
//node js utility library
const bodyParser = require("body-parser");
//express session library
const session = require("express-session");
//uppy related companion library
const companion = require("@uppy/companion");
//cors library
const cors = require("cors");
//initialize express
const app = express();

//cors options
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "*",
};

//allow app to use bodyParser
app.use(bodyParser.json());

//allow app to use session
app.use(
  session({
    secret: "some-secret",
    resave: true,
    saveUninitialized: true,
  })
);

//add cors options
app.use(cors(corsOptions));

//set header
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  next();  
});

// Routes
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send("Welcome to Companion");  
});

// initialize uppy
const uppyOptions = {
  providerOptions: {
    drive: {
      key: "your google key",
      secret: "your google secret",
    },
    instagram: {
      key: "your instagram key",
      secret: "your instagram secret",
    },
    dropbox: {
      key: "your dropbox key",
      secret: "your dropbox secret",
    },
    box: {
      key: "your box key",
      secret: "your box secret",
    },
    s3: {
      getKey: (req, filename) => {        
        return filename;         
      },
      key: "AKIA47QXRZ3MUIQTOBXJ",
      secret: "lFblDM/D+BAvWSM5rPA4Vae9tqgjYG/GE681OmhR",
      bucket: "maxtrans-files",
    },
    // you can also add options for additional providers here
  },
  server: {
    host: "localhost:3020",
    protocol: "http",
  },
  filePath: "./output",
  secret: "some-secret",
  debug: true,
};

app.use(companion.app(uppyOptions));

// handle 404
app.use((req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// handle server errors
app.use((err, req, res) => {
  console.error("\x1b[31m", err.stack, "\x1b[0m");
  res.status(err.status || 500).json({ message: err.message, error: err });
});

companion.socket(app.listen(8080));

console.log("Welcome to Companion!");
console.log(`Listening on http://0.0.0.0:${8080}`);
