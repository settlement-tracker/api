function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
}

module.exports = ensureAuthenticated;
