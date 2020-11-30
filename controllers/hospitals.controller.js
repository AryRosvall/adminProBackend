const { response } = require('express');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/hospital.model');
const { generateJWT } = require('../helpers/jwt');

const getHospitals = async (req, res = response) => {

  const hospitals = await Hospital.find().populate('user', 'name img');
  res.json({
    ok: true,
    hospitals,
    uid: req.uid
  });
}

const createHospitals = async (req, res = response) => {

  const { name } = req.body;

  try {

    const hospitalExists = await Hospital.findOne({ name });
    console.log("hospitalExists", hospitalExists)

    if (hospitalExists) {
      return res.status(400).json({
        ok: false,
        msg: 'Hospital already exists'
      })
    }

    const uid = req.uid;
    const hospital = new Hospital({
      user: uid,
      ...req.body
    });

    // Save hospital
    const hospitalSaved = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalSaved
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    });
  }
}

//TODO Validate token and check if the hospital is correct
const updateHospital = async (req, res = response) => {
  try {

    const uid = req.params.id;

    const hospital = await Hospital.findById(uid);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: `The hospital with the uid ${uid} doesn't exists`
      })
    }

    // Update hospital
    const { password, google, email, ...fields } = req.body;

    if (hospital.email !== email) {
      const emailExists = await Hospital.findOne({ email: email })
      if (emailExists) {
        return res.status(404).json({
          ok: false,
          msg: `This email is already taken`
        })
      }
    }

    fields.email = email;
    const updatedHospital = await Hospital.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      hospital: updatedHospital
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}

const deleteHospital = async (req, res = response) => {

  try {

    const { id } = req.params;

    const hospital = await Hospital.findById(id);
    console.log("hospital", hospital)

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: `The hospital with the uid ${id} doesn't exists`
      })
    }

    await Hospital.findOneAndDelete({ '_id': id });

    res.json({
      ok: true,
      msg: 'Hospital deleted'
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
  getHospitals,
  createHospitals,
  updateHospital,
  deleteHospital
};