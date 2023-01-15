const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dt: {
    date: String,
    time: String
   }
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;