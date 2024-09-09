const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Word = sequelize.define('Word', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Word;
};
