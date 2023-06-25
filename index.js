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


//Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
});


//views
app.set('view engine', 'ejs');
app.use(expressLayouts);
//login register routes 
//views
app.get('/login', (req, res) => res.render('public/login'));
app.get('/register', (req, res) => res.render('public/register'));



//api routes
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create a new user
    const newUser = new User({
      username: username,
      password: hashedPassword,
      is_active: true,
      is_admin: true
    });

    // Save the user to the database
    const [{ id }] = await User.create(newUser)




    newUser.id = id;
    // Log the user in
    req.logIn(newUser, err => {
      if (err) {
        return next(err);
      }

      return res.redirect('/users/' + newUser.username);
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




app.use('/users', userRoutes);