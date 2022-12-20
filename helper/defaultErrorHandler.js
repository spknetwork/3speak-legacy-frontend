const fs = require("fs");
module.exports = function (err, req, res, next) {

  if (err.status !== 404) {
    console.log(err)
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  let template = "new/error/500";

  if (fs.existsSync(__dirname + "/../views/new/error/" + err.status + ".twig")) {
    template = "new/error/" + err.status
  }

  if (!err.status) {
    err.status = 500;
  }
  if (!err.link) {
    err.link = "/"
  }

  if (req.originalUrl.indexOf("apiv2") > -1) {

    return res.json({
      error: err.message
    })
  }

  res.render(template);
}
