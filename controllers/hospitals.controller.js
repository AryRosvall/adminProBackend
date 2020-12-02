const { response } = require('express');

const Hospital = require('../models/hospital.model');

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

const updateHospital = async (req, res = response) => {
  try {

    const hospitalId = req.params.id;
    const uid = req.uid;

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: `The hospital with the uid ${hospitalId} doesn't exists`
      })
    }

    // Update hospital
    const hospitalChanges = {
      ...req.body,
      user: uid
    };

    const updatedHospital = await Hospital.findByIdAndUpdate(hospitalId, hospitalChanges, { new: true });

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

    const id = req.params.id;
    const hospital = await Hospital.findById(id);

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