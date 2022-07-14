const { User, Thought } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
      Thought.find()
        .then(async (thoughts) => {
          const thoughtObj = {
            thoughts,
          };
          return res.json(thoughtObj);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Get a single thought
    getSingleThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .lean()
        .then(async (thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json({
                thought,
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Create a new thought
    createThought(req, res) {
      Thought.create(req.body)
        .then((thought) => User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought } },
          { runValidators: true, new: true }
        ))
        .then((user) =>{
          if (!user){
            Thought.findOneAndRemove({ _id: req.body.thoughtId });
            return res.status(404).json({ message: 'No such user exists to add the thought to!' });
          } else {
            return res.json({ message: 'Thought added successfully' })
          }
        })
        .catch((err) => res.status(500).json(err));
    },

    // Delete a thought
    deleteThought(req, res) {
      Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No such thought exists' })
            : res.json({ message: 'Thought removed successfully' })
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
    
    updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
    },

    // Add a friend to the user
    addReaction(req, res) {
        console.log('You are adding a reaction');
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Remove reaction from a thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'No user thought with that ID :(' })
            : res.json({ message: 'Reaction deleted Successfully' })
        )
        .catch((err) => res.status(500).json(err));
    },
  };