const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res = response) => {

  const from = Number(req.query.from) || 0;

  const [users, total] = await Promise.all([
    User.find({}, 'name email role google')
      .skip(from)
      .limit(5),
    User.count()
  ])

  res.json({
    ok: true,
    users,
    uid: req.uid,
    total
  });
}

const createUsers = async (req, res = response) => {

  const { email, password } = req.body;

  try {

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: 'User already exists'
      })
    }

    const user = new User(req.body);

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    const token = await generateJWT(user._id);

    res.json({
      ok: true,
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    });
  }
}

const updateUser = async (req, res = response) => {
  try {

    const uid = req.params.id;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: `The user with the uid ${uid} doesn't exists`
      })
    }

    // Update user
    const { password, google, email, ...fields } = req.body;

    if (user.email !== email) {
      const emailExists = await User.findOne({ email: email })
      if (emailExists) {
        return res.status(403).json({
          ok: false,
          msg: `This email is already taken`
        })
      }
    }

    if (!user.google) {
      fields.email = email;
    } else if (user.email !== email) {
      return res.status(403).json({
        ok: false,
        msg: `Google user can't change their email`
      })
    }
    const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}

const deleteUser = async (req, res = response) => {

  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: `The user with the uid ${id} doesn't exists`
      })
    }

    await User.findOneAndDelete({ '_id': id });

    res.json({
      ok: true,
      msg: 'User deleted'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }

}


module.exports = {
  getUsers,
  createUsers,
  updateUser,
  deleteUser
};