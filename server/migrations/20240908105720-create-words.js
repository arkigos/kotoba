const { DataTypes } = require('sequelize');
const sequelize = require('./path_to_your_sequelize_instance');

// Define the Word model
const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hiragana: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  english: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Words',  // Ensure it uses the correct table name (pluralized)
  timestamps: true,    // Enable timestamps (since your table has createdAt and updatedAt)
});

module.exports = Word;
