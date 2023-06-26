function ensureAuthenticated(req, res, next) {

  const apiKey = process.env.API_KEY;
  const token = req.headers['api-key'];

  if (apiKey === token) {
    return next();
  } else if (req.isAuthenticated()) {
    return next();
  } else {
    // User is not authenticated, redirect to login page
    // res.redirect('/login');
    res.status(403).send('not logged in ');
  }
}

module.exports = ensureAuthenticated;
