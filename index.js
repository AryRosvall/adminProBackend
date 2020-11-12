require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

try {
  // Create express server
  const app = express();

  app.use(cors());

  // Read and parse body
  app.use(express.json());

  // Database
  dbConnection();

  // Routes
  app.use('/api/users', require('./routes/users.route'));
  app.use('/api/login', require('./routes/auth.route'));


  app.get('/', (req, res) => {
    res.json({
      ok: true,
      msg: 'Hola Mundo'
    });
  });


  app.listen(3000, () => {
    console.log(`Server running at port ${process.env.PORT}`);
  });

} catch (error) {
  console.log(error)
}