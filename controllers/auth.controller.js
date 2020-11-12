const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');


const login = async (req, res = response) => {
  try {

    const { email, password } = req.body;

    // Verify email
    const userDB = await User.findOne({ email });


    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Verify your credentials'
      })
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, userDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Verify your credentials'
      })
    }

    // Generate token - JWT
    const token = await generateJWT(userDB.id);

    res.status(200).json({
      ok: true,
      token
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}

module.exports = {
  login
}