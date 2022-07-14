const router = require('express').Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/users/:userId
router.route('/:thoughtId').get(getSingleThought).delete(deleteThought).put(updateThought);

// /api/users/:userId/friends
router.route('/:thoughtId/reactions').post(addReaction)

// /api/users/:userId/friends/:friendId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;