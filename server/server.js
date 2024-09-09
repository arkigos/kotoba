const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite') // Path to your SQLite database file
});

// Define a model (example: Word model)
const Word = sequelize.define('Word', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Middleware to serve static files (audio, images, and build)
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../build')));

// API route to fetch words from SQLite database
app.get('/api/words', async (req, res) => {
  try {
    const words = await Word.findAll();
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

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});
