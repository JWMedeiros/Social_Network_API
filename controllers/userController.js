const { User, Thought } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
      User.find()
        .then(async (users) => {
          const userObj = {
            users,
          };
          return res.json(userObj);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Get a single user
    getSingleUser(req, res) {
      User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean()
        .then(async (user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json({
                user,
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // create a new user
    createUser(req, res) {
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // Delete a user and their thoughts
    deleteUser(req, res) {
      User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No such user exists' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
    
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
    },

    // Add a friend to the user
    addFriend(req, res) {
        User.create(req.body)
          .then((friend) => {
            return User.findOneAndUpdate(
              { _id: req.params.userId },
              { $addToSet: { friends: friend._id } },
              { new: true }
            );
          })
          .then((user) =>
            !user
              ? res.status(404).json({message: 'Friend created, but found no user with that ID'})
              : res.json('Created and added your friend! 🎉')
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    // Remove friend from a user
    deleteFriend(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends:req.params.friendId } },
        { new: true })
        .then((user) =>
            !user
            ? res.status(404).json({ message: 'No user found with that ID :(' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
  };
