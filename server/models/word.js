'use strict';
const { Model } = require('sequelize');
// Sequelize model definition
module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define('Word', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    word: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hiragana: {
      type: DataTypes.STRING,
      allowNull: false
    },
    english: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  return Word;
};

