const { sequelize } = require('./models');  // Adjust path if needed

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })
  .finally(() => {
    sequelize.close();
  });
