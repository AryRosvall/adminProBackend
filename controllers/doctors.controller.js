const { response } = require('express');
const bcrypt = require('bcryptjs');

const Doctor = require('../models/doctor.model');
const { generateJWT } = require('../helpers/jwt');

const getDoctors = async (req, res = response) => {

  const doctors = await Doctor.find()
    .populate('user', 'name img')
    .populate('hospitals', 'name img');

  res.json({
    ok: true,
    doctors,
    uid: req.uid
  });
}

const createDoctors = async (req, res = response) => {

  const { name } = req.body;

  try {

    const doctorExists = await Doctor.findOne({ name });

    if (doctorExists) {
      return res.status(400).json({
        ok: false,
        msg: 'Doctor already exists'
      })
    }

    const uid = req.uid;
    const doctor = new Doctor({
      user: uid,
      ...req.body
    });

    // Save doctor
    const doctorSaved = await doctor.save();

    res.json({
      ok: true,
      doctor: doctorSaved
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    });
  }
}

//TODO Validate token and check if the doctor is correct
const updateDoctor = async (req, res = response) => {
  try {

    const uid = req.params.id;

    const doctor = await Doctor.findById(uid);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: `The doctor with the uid ${uid} doesn't exists`
      })
    }

    // Update doctor
    const { password, google, email, ...fields } = req.body;

    if (doctor.email !== email) {
      const emailExists = await Doctor.findOne({ email: email })
      if (emailExists) {
        return res.status(404).json({
          ok: false,
          msg: `This email is already taken`
        })
      }
    }

    fields.email = email;
    const updatedDoctor = await Doctor.findByIdAndUpdate(uid, fields, { new: true });

    res.json({
      ok: true,
      doctor: updatedDoctor
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    })
  }
}

const deleteDoctor = async (req, res = response) => {

  try {

    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    console.log("doctor", doctor)

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: `The doctor with the uid ${id} doesn't exists`
      })
    }

    await Doctor.findOneAndDelete({ '_id': id });

    res.json({
      ok: true,
      msg: 'Doctor deleted'
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
  getDoctors,
  createDoctors,
  updateDoctor,
  deleteDoctor
};