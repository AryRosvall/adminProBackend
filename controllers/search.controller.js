const { response } = require('express');
const User = require('../models/user.model');
const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');


const getAll = async (req, res = response) => {

  try {

    const searchWord = req.params.searchWord;

    const regex = new RegExp(searchWord, 'i');

    const [users, hospitals, doctors] = await Promise.all([
      User.find({ name: regex }),
      Hospital.find({ name: regex }),
      Doctor.find({ name: regex }),
    ])

    res.status(200).json({
      ok: true,
      users,
      hospitals,
      doctors
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}
const getCollection = async (req, res = response) => {

  try {

    const table = req.params.table;
    const searchWord = req.params.search;

    const regex = new RegExp(searchWord, 'i');

    let data = [];

    switch (table) {
      case 'doctors':
        data = await Doctor.find({ name: regex }).populate('user', 'name img').populate('hospitals', 'name img');
        break;
      case 'users':
        data = await User.find({ name: regex }).populate('user', 'name img');
        break;
      case 'hospitals':
        data = await Hospital.find({ name: regex });
        break;

      default:
        return res.status(400).json({
          ok: false,
          msg: 'The table must be users/doctors/hospitals'
        })
    }

    res.status(200).json({
      ok: true,
      results: data
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
  getAll,
  getCollection
};