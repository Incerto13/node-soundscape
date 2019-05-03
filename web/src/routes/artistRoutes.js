const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:artistRoutes');

const dbName = 'nodeSoundscape';

const artistRouter = express.Router();

function router(mongoUrl) {
  artistRouter.route('/')
    .get((req, res) => {

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(mongoUrl);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('artists');

          const artists = await col.find().toArray(); // display all artists
          const countries = await col.distinct('country'); // for drop-down list
                 
          return res.render(
            'artistListView',
            {
              pageTitle: 'Artist List',
              artists,
              countries,
              country: null, // initially null, need to define here for template logic
              path: '/artists',
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  artistRouter.route('/filtered') // can't have this route after the ('/:id') path!!
    .get((req, res) => {
      let { country } = req.query;
      // in case no country was selected in request
      if (country === 'null' || country == undefined) {
        country = { $exists: true };
      }

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(mongoUrl);
          debug('Connected correctly to server @ /filtered');

          const db = client.db(dbName);
          const col = await db.collection('artists');
    
          const artists = await col.find({ country }).toArray(); // filter artists listed by country field
          const countries = await col.distinct('country'); // for drop-down list
          debug(req.query);
          debug(`Artists: ${artists[0]}`);

          return res.render(
            'artistListView',
            {
              pageTitle: 'Artist List',
              artists,
              countries,
              country, // to display relavent country in query result
              path: '/artists',
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  artistRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(mongoUrl);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('artists');

          const artist = await col.findOne({ _id: new ObjectID(id) });
          debug(artist);
       
          return res.render(
            'artistView',
            {
              pageTitle: 'Artist View',
              artist,
              path: '/artists',
            }
          );
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  return artistRouter;
}


module.exports = router;
