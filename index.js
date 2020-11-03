require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Create express server
const app = express();

app.use(cors);

//Database
dbConnection();

//Routes
app.get('/', (req, res) => {
  res.json({
    ok: true,
    msg: 'Hola Mundo'
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
})