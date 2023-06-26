require('dotenv').config()
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

const User = require('./models/user');


const app = express();

const port = process.env.LISTEN_PORT || 3001;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

const cors = require('cors');

const allowedOrigins = process.env.CORS_ORIGINS.split(',');

// app.use(cors({
//   origin: 'http://your-client-domain.com',
//   credentials: true
// }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true
}));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// Use built-in Express body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isSecure = process.env.NODE_ENV === 'production';
//setup session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // rolling: false,
  cookie: {
    maxAge: 48 * 60 * 60 * 1000, // 48 hours
    // maxAge: 2000
    sameSite: isSecure ? 'none' : 'lax', // Set SameSite attribute based on environment
    secure: isSecure // Set Secure attribute based on environment
  }
}));
//setup passport
app.use(passport.initialize());
app.use(passport.session());

require('./middleware/passportSetup');


//views

// //Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });
app.set('view engine', 'ejs');
app.use(expressLayouts);
//login register routes 
//views
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);


app.use('/users', userRoutes);