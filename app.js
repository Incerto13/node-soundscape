const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const db = mongoose.connect('mongodb://localhost/nodeSoundscape', {
  useCreateIndex: true,
  useNewUrlParser: true
});
const port = process.env.PORT || 3000; // use the env variable, if it's not there use 3000

const Artist = require('./src/api/models/artistModel');
const Event = require('./src/api/models/eventModel');
const api_artistRouter = require('./src/api/routes/api_artistRoutes')(Artist);
const api_eventRouter = require('./src/api/routes/api_eventRoutes')(Event);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// root directory to look for css & static files (from perspective of index file)
app.use(express.static(path.join(__dirname, '/src/views')));
// The following are the ADDITIONAL directories to look at for
// static files in addition to public directory
app.use('/css', express.static(path.join(__dirname, '/views/assets/css')));
app.use('/js', express.static(path.join(__dirname, '/views/assets//js')));
app.use(
  '/js',
  express.static(path.join(__dirname, '/node_modules/jquery/dist'))
);
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/artists', title: 'Artists' },
  { link: '/events', title: 'Events' },
  { link: '/api', title: 'API' }
];

const artistRouter = require('./src/routes/artistRoutes')(nav);
const eventRouter = require('./src/routes/eventRoutes')(nav);

app.use('/artists', artistRouter);
app.use('/events', eventRouter);

app.get('/', (req, res) => {
  res.render('index', {
    nav,
    pageTitle: 'Soundscape',
    path: '/',
  });
});

/* ***** API Landing Page ***** */
// HATEOAS - Self-Documenting Hyperlinks within the API
app.get('/api', (req, res) => {
  const artists = { name: 'artists', link: `http://${req.headers.host}/api/artists` };
  const events = { name: 'events', link: `http://${req.headers.host}/api/events` };
  res.json(
    {
      header: 'Welcome to the REST API for this site. Below are the major endpoints.',
      endpoints: [artists, events],
    }
  );
});

/* ***** API Routing ***** */
app.use('/api/artists', api_artistRouter);
app.use('/api/events', api_eventRouter);


app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
