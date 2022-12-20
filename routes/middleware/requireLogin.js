module.exports = (req, res, next) => {

  if (req.session.user) {

    return next();

  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');

};
