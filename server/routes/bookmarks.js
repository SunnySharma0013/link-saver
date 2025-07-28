const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Bookmark = require('../models/Bookmark');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log("User from token:", req.user);  
    const bookmarks = await Bookmark.find({ user: req.user.id });
    console.log("Fetched bookmarks:", bookmarks); 
    res.json(bookmarks);
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ message: 'Error fetching bookmarks', error: err.message });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  const { url } = req.body;

  try {
    // Try fetching title but allow saving even if fetch fails
    let title = "No title fetched";
    try {
      const response = await fetch(url, { timeout: 5000 });
      const html = await response.text();
      const $ = cheerio.load(html);
      title = $('title').text().trim() || title;
    } catch (err) {
      console.warn("⚠️ Failed to fetch title, saving with default title");
    }

    const bookmark = new Bookmark({
      url,
      title,
      user: req.user.id,
    });

    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error("❌ Error saving bookmark:", err);
    res.status(500).json({ message: 'Error saving bookmark', error: err.message });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark deleted' });
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    res.status(500).json({ message: 'Error deleting bookmark' });
  }
});

module.exports = router;
