const express = require('express');
const eventController = require('../controllers/eventsController');

function routes(Event) {
  const controller = eventController(Event);
  const eventRouter = express.Router();
  eventRouter.route('/')
    .post(controller.post)
    .get(controller.get);

  eventRouter.use('/:eventId', (req, res, next) => {
    /* this function is middleware, handles lookup logic for all CRUD functions going to this route
    which are all in the controller file
    */
    Event.findById(req.params.eventId, (err, event) => {
      if (err) {
        return res.send(err);
      }
      if (event) {
        req.event = event;
        return next(); // go onto next function in stack
      }
      return res.sendStatus(404); // book not found
    });
  });

  eventRouter.route('/:eventId')
    .get(controller.getOne)
    .put(controller.put)
    .patch(controller.patch)
    .delete(controller.del);

  return eventRouter;
}

module.exports = routes;
