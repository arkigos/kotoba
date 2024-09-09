const { Word } = require('./models');  // Import the Word model

(async () => {
  try {
    const words = await Word.findAll();
    console.log('Words in database:', words);
  } catch (error) {
    console.error('Error querying words:', error);
  }
})();

