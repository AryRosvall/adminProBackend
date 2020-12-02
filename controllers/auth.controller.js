const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');



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
    return res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}

const googleSignIn = async (req, res = response) => {

  try {
    const { token: googleToken } = req.body;
    const { name, email, picture } = await googleVerify(googleToken);

    // verify if user exists
    const userDB = await User.findOne({ email });

    let user;

    if (!userDB) {
      user = new User({
        name,
        email,
        password: '@@@',
        img: picture,
        google: true
      })
    } else {
      user = userDB;
      user.google = true;
      user.password = '@@@';
    }

    // Save in DB
    await user.save();

    // Generate token - JWT
    const token = await generateJWT(user.id);

    res.status(200).json({
      ok: true,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token'
    });
  }
}

const renewToken = async (req, res = response) => {

  try {

    const uid = req.uid;
    const token = await generateJWT(uid);

    res.status(200).json({
      ok: true,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token'
    });
  }
}


module.exports = {
  login,
  googleSignIn,
  renewToken
}