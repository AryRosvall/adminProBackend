
const { response } = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { updateImage, verifyIdInDatabase } = require('../helpers/update-image');

const uploadFile = async (req, res = response) => {

  try {

    const { table, id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
      return res.status(400).json({
        ok: false,
        msg: 'No files were uploaded.'
      });
    }

    // Check valid file extensions
    const file = req.files.image;
    const splittedName = file.name.split('.');
    const extension = splittedName[splittedName.length - 1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (!validExtensions.includes(extension)) {
      return res.status(400).json({
        ok: false,
        msg: 'Unsupported file type. Try again with a jpg/jpeg/png/gif file.'
      });
    }

    // Generate unique filename
    const filename = `${uuidv4()}.${extension}`;

    // Path to save image
    const path = `./uploads/${table}/${filename}`;

    // Verify if id exists in database
    const model = await verifyIdInDatabase(table, id);

    if (!model) {
      return res.status(500).json({
        ok: false,
        msg: 'Id doesn\'t exists'
      });
    }
    file.mv(path, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          ok: false,
          msg: 'Ups! something went wrong'
        });
      }

      //Update database
      const imageUpdated = await updateImage(table, filename, model);

      if (!imageUpdated) {
        return res.status(500).json({
          ok: false,
          msg: 'Image can\'t be updated'
        });
      }

      res.status(200).json({
        ok: true,
        msg: `File uploaded`,
        filename
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    });
  }
}


const returnFile = (req, res) => {

  try {
    const { table, photo } = req.params;
    let pathFile = path.join(__dirname, `../uploads/${table}/${photo}`);

    // Default Image
    if (!fs.existsSync(pathFile)) {
      pathFile = path.join(__dirname, `../uploads/no-img.jpg`);
    }

    res.sendFile(pathFile);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Ups! something went wrong'
    });
  }
}

module.exports = {
  uploadFile,
  returnFile
};
