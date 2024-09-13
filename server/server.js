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
app.get('/api/:langCode/lessons.json', (req, res) => {
  const langCode = req.params.langCode; // Extract the language code
  const lessonsFilePath = path.join(__dirname, `data/${langCode}/lessons.json`);
  
  if (fs.existsSync(lessonsFilePath)) {
    const lessons = JSON.parse(fs.readFileSync(lessonsFilePath, 'utf8'));
    res.json(lessons);
  } else {
    res.status(404).send({ error: 'Lessons file not found for this language' });
  }
});

app.get('/api/:langCode/:lessonFile', (req, res) => {
  const { langCode, lessonFile } = req.params;
  const lessonFilePath = path.join(__dirname, `data/${langCode}/${lessonFile}`);

  if (fs.existsSync(lessonFilePath)) {
    const lesson = JSON.parse(fs.readFileSync(lessonFilePath, 'utf8'));
    res.json(lesson);
  } else {
    res.status(404).send({ error: 'Lesson file not found for this language' });
  }
});

app.get('/server/data/languages.json', (req, res) => {
  const languagesFilePath = path.join(__dirname, 'data/languages.json'); // Path to your languages.json file
  
  if (fs.existsSync(languagesFilePath)) {
    const languages = JSON.parse(fs.readFileSync(languagesFilePath, 'utf8'));
    res.json(languages);
  } else {
    res.status(404).send({ error: 'Languages file not found' });
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



