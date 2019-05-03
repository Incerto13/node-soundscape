/* eslint-disable no-plusplus */

const debug = require('debug')('app:eventsController');


function eventsController(Event) {
  function post(req, res) {
    const event = new Event(req.body);
    event.save();
    return res.status(201).json(event);
  }

  function get(req, res) {
    const query = {};
    /* Allowed url parameters:
    any parameters other than these (even if valid)
    will not be processeed
    */
    if (req.query.title) {
      query.title = req.query.title;
    }
    if (req.query.venue) {
      query.venue = req.query.venue;
    }
    if (req.query.city) {
      query.city = req.query.city;
    }
    if (req.query.country) {
      query.country = req.query.country;
    }
    if (req.query.artists) {
      query.artists = req.query.artists;
    }
    Event.find(query, (err, events) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnEvents = events.map((event) => {
        const newEvent = event.toJSON();
        newEvent.links = {};
        newEvent.links.self = `http://${req.headers.host}/api/events/${event._id}`;
        return newEvent;
      });
      return res.json(returnEvents);
    });
  }

  function getOne(req, res) {
    Event.findById(req.params.eventId, (err, event) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS to filter by category
      const returnEvent = event.toJSON();
      const venue = event.venue.replace(' ', '%20');
      const city = event.city.replace(' ', '%20');
      const country = event.country.replace(' ', '%20');
      const { artists } = event;

      returnEvent.links = {};
      returnEvent.links.FilterByThisVenue = `http://${req.headers.host}/api/events/?venue=${venue}`;
      returnEvent.links.FilterByThisCity = `http://${req.headers.host}/api/events/?city=${city}`;
      returnEvent.links.FilterByThisCountry = `http://${req.headers.host}/api/events/?country=${country}`;

      returnEvent.links.FilterByThisArtist = {}; // object that will hold all the artist links
      // populate the obejct with all the artists listed for this event
      for (let i = 0; i < artists.length; i++) {
        let artist = artists[i];
        debug(`Artist ${i}: ` + artist);
        artist = artist.replace(' ', '%20');
        returnEvent.links.FilterByThisArtist[`${artist}`] = `http://${req.headers.host}/api/events/?artists=${artist}`;
      }

      return res.json(returnEvent);
    });
  }

  function put(req, res) {
    const { event } = req;
    event.title = req.body.title;
    event.date = req.body.date;
    event.venue = req.body.venue;
    event.city = req.body.city;
    event.country = req.body.country;
    event.artists = req.body.artists;
    req.event.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(event);
    });
  }

  function patch(req, res) {
    const { event } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      event[key] = value;
    });
    req.event.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(event);
    });
  }

  function del(req, res) {
    req.event.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = eventsController;
