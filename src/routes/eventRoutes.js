const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:eventRoutes');
const dateFormat = require('dateformat');

const url = 'mongodb://localhost/nodeSoundscape';
const dbName = 'nodeSoundscape';

const eventRouter = express.Router();

function router(nav) {
  eventRouter.route('/')
    .get((req, res) => {

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('events');

          const events = await col.find().toArray(); // display all events
          debug(events);
          const venues = await col.distinct('venue'); // for drop-down list
          const cities = await col.distinct('city');
          const countries = await col.distinct('country');
          const artists = await col.distinct('artists');
          // format event dates
          for (let i = 0; i < events.length; i++) {
            const newDate = dateFormat(events[i].date, 'fullDate');
            events[i].date = newDate;
          }
          debug(req.query);

          return res.render(
            'eventListView',
            {
              nav,
              pageTitle: 'Event List',
              events,
              venues,
              cities,
              countries,
              artists,
              venue: null, // initially null, need to define here for template logic
              city: null,
              country: null,
              artist: null,
              path: '/events',

            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  eventRouter.route('/filtered') // can't have this after the ('/:id') path
    .get((req, res) => {
      let { venue } = req.query;
      // in case no country was selected
      if (venue === 'null' || venue == undefined) {
        venue = { $exists: true };
      }
      let { city } = req.query;
      // in case no country was selected
      if (city === 'null' || city == undefined) {
        city = { $exists: true };
      }
      let { country } = req.query;
      // in case no country was selected
      if (country === 'null' || country == undefined) {
        country = { $exists: true };
      }
      let { artist } = req.query;
      // in case no country was selected
      if (artist === 'null' || artist == undefined) {
        artist = { $exists: true };
      }
      
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server @ /filtered');

          const db = client.db(dbName);
          const col = await db.collection('events');
          
          // payload: generate array of events filtered by selected categories
          const events = await col.find(
            {
              venue,
              city,
              country,
              artists: artist,
            }
          )
            .toArray();
            
          debug(`Filtered Events: ${events[0]}`);
          debug(`Filtered Venue: ${city}`);
          debug(`Filtered Country: ${country}`);
          debug(`Filtered Artist: ${artist}`);

          const venues = await col.distinct('venue'); // for drop-down list
          const cities = await col.distinct('city');
          const countries = await col.distinct('country');
          const artists = await col.distinct('artists');
          // format event dates
          for (let i = 0; i < events.length; i++) {
            const newDate = dateFormat(events[i].date, 'fullDate');
            events[i].date = newDate;
          }
          debug(req.query);

          return res.render(
            'eventListView',
            {
              nav,
              pageTitle: 'Event List',
              events,
              venues,
              cities,
              countries,
              artists,
              venue, // to display relavent values query results
              city,
              country,
              artist,
              mytable: "<table cellpadding=\"0\" cellspacing=\"0\"><tbody><tr>",
              path: '/events',

            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  eventRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);
          const col = await db.collection('events');

          const event = await col.findOne({ _id: new ObjectID(id) });
          const newDate = dateFormat(event.date, 'fullDate');
          event.date = newDate;
          debug(event);
       
          return res.render(
            'eventView',
            {
              nav,
              pageTitle: 'Event View',
              event,
              path: '/events',
            }
          );
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  return eventRouter;
}


module.exports = router;
