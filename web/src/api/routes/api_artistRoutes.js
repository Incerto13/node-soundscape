const express = require('express');
const artistsController = require('../controllers/artistsController');

function routes(Artist) {
  const controller = artistsController(Artist);
  const artistRouter = express.Router();

  artistRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  artistRouter.use('/:artistId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    Artist.findById(req.params.artistId, (err, artist) => {
      if (err) {
        return res.send(err);
      }
      if (artist) {
        req.artist = artist;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // book not found
    });
  });

  artistRouter.route('/:artistId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return artistRouter;
}

module.exports = routes;
