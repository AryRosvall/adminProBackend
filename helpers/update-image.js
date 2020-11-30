const fs = require('fs');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');

const deleteImage = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

const verifyIdInDatabase = async (table, id) => {

  let model;
  switch (table) {
    case 'hospitals':
      model = await Hospital.findById(id);
      break;

    case 'doctors':
      model = await Doctor.findById(id);
      break;

    case 'users':
      model = await User.findById(id);
      break;
  }

  return model || false;
}
const updateImage = async (table, filename, model) => {

  try {

    let oldImage = '';
    oldImage = model.img;
    model.img = filename;

    // Verify if an old image exists previously
    const oldPath = `./uploads/${table}/${oldImage}`;

    await model.save();
    deleteImage(oldPath);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  updateImage,
  verifyIdInDatabase
}