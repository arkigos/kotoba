const express = require('express');
const path = require('path');
// Use the promise-based fs API to avoid blocking the event loop with
// synchronous file system calls.
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (audio, images, etc.) from the server/public folder
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, '../build'))); // For serving React build

// Load lesson files dynamically
app.get('/api/:langCode/lessons.json', async (req, res) => {
  const langCode = req.params.langCode; // Extract the language code
  const lessonsFilePath = path.join(
    __dirname,
    `data/${langCode}/lessons.json`
  );

  try {
    const fileData = await fs.readFile(lessonsFilePath, 'utf8');
    const lessons = JSON.parse(fileData);
    res.json(lessons);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res
        .status(404)
        .send({ error: 'Lessons file not found for this language' });
    } else {
      res.status(500).send({ error: 'Failed to load lessons file' });
    }
  }
});

app.get('/api/:langCode/:lessonFile', async (req, res) => {
  const { langCode, lessonFile } = req.params;
  const lessonFilePath = path.join(
    __dirname,
    `data/${langCode}/${lessonFile}`
  );

  try {
    const fileData = await fs.readFile(lessonFilePath, 'utf8');
    const lesson = JSON.parse(fileData);
    res.json(lesson);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send({ error: 'Lesson file not found for this language' });
    } else {
      res.status(500).send({ error: 'Failed to load lesson file' });
    }
  }
});

app.get('/server/data/languages.json', async (req, res) => {
  const languagesFilePath = path.join(
    __dirname,
    'data/languages.json'
  ); // Path to your languages.json file

  try {
    const fileData = await fs.readFile(languagesFilePath, 'utf8');
    const languages = JSON.parse(fileData);
    res.json(languages);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send({ error: 'Languages file not found' });
    } else {
      res.status(500).send({ error: 'Failed to load languages file' });
    }
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



