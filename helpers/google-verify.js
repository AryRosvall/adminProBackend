const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const googleVerify = async (token) => {

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, picture } = payload;
  return { name, email, picture };
}

module.exports = { googleVerify };