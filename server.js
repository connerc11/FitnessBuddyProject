const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
// init handlebars for html templates
const hbs = exphbs.create({});

// init server
const PORT = process.env.PORT || 3002;



// Express session for session cookies
const session = require('express-session');
// Sequelize store session
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// init sessions
const sess = {
    secret: 'secret secret server',
    //process.env.SESSION_SECRET
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };
// sess.cookie.secure = true;
// sess.cookie.sameSite = "none";
// sess.cookie.simpleTest = "simpleTest"
  app.use(session(sess));
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  
//express parses json and string data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
// path to public directory for static files
  app.use(express.static(path.join(__dirname, 'public')));

  //path to routes for server
  app.use(routes);

// turn on connection to db and then to server
// force: true to reset the database and clear all values, updating any new relationships
// force: false to maintain data - aka normal operation
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});