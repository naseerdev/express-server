const mongoose = require('mongoose');
const User = require("./User");

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: { type: mongoose.Types.ObjectId, ref: User },
});

module.exports = mongoose.model('Todo', TodoSchema);
