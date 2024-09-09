'use strict';
const fs = require('fs');
const path = require('path');

// Path to the words.json file
const wordsFilePath = path.join(__dirname, '../data/words.json');

// Read the words.json file
const words = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Words', words.map(word => ({
      id: word.id, // Including the id from words.json
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
