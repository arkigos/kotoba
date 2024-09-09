const express = require('express');
const path = require('path');
const { sequelize, Word } = require('./models'); // Import your existing models
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to serve static files (audio, images, and build)
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../build')));

// API route to fetch words from SQLite database
app.get('/api/words', async (req, res) => {
  try {
    const words = await Word.findAll(); // Use the existing Word model
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Catch-all to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server and sync database
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.sync(); // Use the existing sequelize instance
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});
