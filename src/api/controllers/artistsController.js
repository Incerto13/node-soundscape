/* eslint-disable no-param-reassign */


function artistsController(Artist) {
  function post(req, res) {
    const artist = new Artist(req.body);
    artist.save();
    return res.status(201).json(artist);
  }

  function get(req, res) {
    const query = {};
    if (req.query.country) {
      query.country = req.query.country; // filters query strings that can be entered
    }
    Artist.find(query, (err, artists) => {
      if (err) {
        return res.send(err);
      }
      // HATEOAS - Self-Documenting Hyperlinks within the API
      const returnArtists = artists.map((artist) => {
        const newArtist = artist.toJSON();
        newArtist.links = {};
        newArtist.links.self = `http://${req.headers.host}/api/artists/${artist._id}`;
        return newArtist;
      });
      return res.json(returnArtists);
    });
  }

  function getOne(req, res) {
    // HATEOAS to filter by category
    const returnArtist = req.artist.toJSON();
    const country = req.artist.country.replace(' ', '%20');
    returnArtist.links = {};
    returnArtist.links.FilterByThisCountry = `http://${req.headers.host}/api/artists/?country=${country}`;
    return res.json(returnArtist);
  }

  function put(req, res) {
    const { artist } = req;
    artist.name = req.body.name;
    artist.bio = req.body.bio;
    artist.country = req.body.country;
    artist.soundcloud = req.body.soundcloud;
    artist.events = req.body.events;
    req.artist.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(artist);
    });
  }

  function patch(req, res) {
    const { artist } = req;
    // eslint-disable-next-line no-underscore-dangle
    if (req.body._id) {
      // eslint-disable-next-line no-underscore-dangle
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      artist[key] = value;
    });
    req.artist.save((err) => {
      if (err) {
        return res.send(err);
      }
      return res.json(artist);
    });
  }

  function del(req, res) {
    req.artist.remove((err) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204); // successfully deleted
    });
  }

  // eslint-disable-next-line object-curly-newline
  return { post, get, getOne, put, patch, del };
}

module.exports = artistsController;
