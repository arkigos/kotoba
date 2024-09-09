const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (audio, images, etc.) from the server/public folder
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../build'))); // For serving React build

// Load lesson files dynamically
app.get('/api/lessons.json', (req, res) => {
  const lessonsFilePath = path.join(__dirname, 'data/lessons.json');
  const lessons = JSON.parse(fs.readFileSync(lessonsFilePath, 'utf8'));
  res.json(lessons);
});

app.get('/api/lesson/:lessonFile', (req, res) => {
  const lessonFilePath = path.join(__dirname, `data/${req.params.lessonFile}`);
  if (fs.existsSync(lessonFilePath)) {
    const lesson = JSON.parse(fs.readFileSync(lessonFilePath, 'utf8'));
    res.json(lesson);
  } else {
    res.status(404).send({ error: 'Lesson file not found' });
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
