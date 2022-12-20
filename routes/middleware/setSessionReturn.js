module.exports = (req, res, next) => {

  try {

    if (req.originalUrl.indexOf('api') === -1 && req.originalUrl.indexOf('css') === -1 && req.originalUrl.indexOf('auth') === -1 && req.originalUrl.indexOf('.js') === -1 && req.originalUrl.indexOf('node_modules') === -1) {

      req.session.returnTo = req.originalUrl;

    }

    next()
  
} catch (e) {

    next() //incase of logout
  
}

};
