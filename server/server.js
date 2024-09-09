const express = require('express');
const path = require('path');
const fs = require('fs'); // To read the words.json file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to serve static files (audio, images, and build)
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../build')));

// Load the JSON data from words.json
const wordsFilePath = path.join(__dirname, 'data/words.json');
const words = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));

// API route to fetch words from the JSON file
app.get('/api/words', (req, res) => {
  try {
    res.json(words); // Send the JSON data as the response
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Catch-all to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
