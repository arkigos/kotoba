'use strict';
const fs = require('fs');
const path = require('path');

const wordsFilePath = path.join(__dirname, '../data/words.json');
const words = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));

console.log('Seeding the following words:', words);  // Log the data

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Words', words.map(word => ({
      id: word.id,
      word: word.word,
      hiragana: word.hiragana || null,
      english: word.english,
      prompt: word.prompt || null,
      createdAt: new Date(),
      updatedAt: new Date()
    })), {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Words', null, {});
  }
};
