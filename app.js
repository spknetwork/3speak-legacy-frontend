const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const longjohn = require('longjohn');
longjohn.async_trace_limit = -1;
const helmet = require('helmet');

const session = require('express-session');
const MemcachedStore = require('connect-memcached')(session);
const {twig, logger, defaultErrorHandler} = require('./helper');
const cors = require('cors');

// const Sentry = require('@sentry/node');
//
// Sentry.init({dsn: APP_SENTRY_DSN});

const host = APP_MEMCACHED_HOST;

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const videoRouter = require('./routes/video');
const leaderBoardRouter = require('./routes/leaderBoard');
const intlRouter = require('./routes/intl');
const settingsRouter = require('./routes/settings');
const encoderRouter = require('./routes/encoder');
const apiRouter = require('./routes/api');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const setSessionReturn = require('./routes/middleware/setSessionReturn');

const app = express();
app.set('trust proxy', true)

app.use(helmet({
  contentSecurityPolicy: false,
  hsts: {
    preload: true,
    maxAge: 31536000
  },
  frameguard: false
}));

// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.errorHandler());

const corsOptions = {
  origin: (o, c) => {

    c(null, true)

  },
  credentials: true
};

app.use(cors(corsOptions));

const sess = {
  secret: AUTH_SESSION_SECRET,
  key: 'frontend',
  proxy: true,
  resave: false,
  saveUninitialized: false,
  store: new MemcachedStore({
    hosts: [host]
  })
};
app.set('etag', false)

app.use(session(sess));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.set('twig options', {
  allowAsync: true, // Allow asynchronous compiling
  strict_variables: false
});

app.engine('twig', twig);


app.use(logger);

app.use(express.json({
  limit: '5mb'
}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(async(req, res, next) => {
    res.locals = Object.assign(res.locals, global)
    if (!req.session.user) {

      delete res.locals.user;
      delete res.locals.identity

    }

    if (req.session.end_session === true) {

      delete res.locals.user;
      delete res.locals.identity
      req.session.destroy(err => {

        req.session = null;
        next();

      })

    } else {

      if (req.session.user) {

        req.session.user_id

        if (req.session.identity) {

          req.user = req.session.identity;
          res.locals.user = req.session.identity;
          res.locals.user.email = req.session.user.email
          res.locals.user.nickname = res.locals.user.username;
          res.locals.user.user_id = res.locals.user.username;
          res.locals.user_id = req.session.user.user_id;
          res.locals.user.isSteem = true;

        } else {

          req.user = req.session.user;
          req.user.username = req.user.email //set email for non chain user
          req.user.nickname = req.user.email //set email for non chain user

          res.locals.user = req.user;
          res.locals.user.email = req.session.user.email
          res.locals.user.isSteem = false;
          res.locals.user_id = req.session.user.user_id;

        }

      }

      next();

    }

  }
)

app.use((req, res, next) => {
  // res.locals.user = {darkMode: true, nickname: 'ned', user_id: 'ned'};
  next();
})

app.use('/', setSessionReturn, indexRouter);
app.use('/intl', setSessionReturn, intlRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use('/leaderboard', setSessionReturn, leaderBoardRouter);
app.use('/settings', settingsRouter);
app.use('/encoder', encoderRouter);
app.use('/apiv2', apiRouter);
app.use('/shop', shopRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  next(createError(404));

});

// error handler
app.use(defaultErrorHandler);

process.on('unhandledRejection', error => {

  // Will print "unhandledRejection err is not defined"
  // eslint-disable-next-line no-console
  console.log('unhandledRejection', error);

});


module.exports = app;
