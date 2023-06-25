require('dotenv').config()
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');

const User = require('./models/user');


const app = express();

const port = process.env.LISTEN_PORT || 3001;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setup session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  // rolling: false,
  cookie: {
    maxAge: 48 * 60 * 60 * 1000 // 48 hours
    // maxAge: 2000
  }
}));
//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  // Match user
  // This should match the user from your database, this is just a placeholder
  User.findOne(username)
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'That username is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    })
    .catch(err => console.log(err));
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});


// //Routes
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });


//views
app.set('view engine', 'ejs');
app.use(expressLayouts);

//login register routes 
//views
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);


app.use('/users', userRoutes);