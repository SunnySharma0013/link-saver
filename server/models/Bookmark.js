const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: 'No title fetched' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
