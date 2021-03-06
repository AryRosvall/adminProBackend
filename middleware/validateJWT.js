
const jwt = require('jsonwebtoken');
const validateJWT = (req, res, next) => {

  try {

    const token = req.header('x-token');

    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: 'Token is empty'
      })
    }

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);

    req.uid = uid;

    next();

  } catch (error) {
    console.log("validateJWT -> error", error)
    return res.status(401).json({
      ok: false,
      msg: 'Unauthorized token'
    })
  }
}

module.exports = {
  validateJWT
}
