const crypto = require("crypto");
const dotenv = require("dotenv");
const got = require("got");

dotenv.config();

function hashPassword(password) {
  const secret = process.env.MOPH_API_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  const data = hmac.update(password);
  const gen_hmac = data.digest("hex");
  return gen_hmac.toUpperCase();
}

async function getNewToken() {
  const hashedPassword = hashPassword(process.env.MOPH_API_PASSWORD);
  console.log(hashedPassword, "hashed");
  const resp = await got.get(
    `${process.env.MOPH_API_URL}/token?Action=get_moph_access_token&user=${process.env.MOPH_API_USERNAME}&password_hash=${hashedPassword}&hospital_code=11770`,
    {
      rejectUnauthorized: false,
      timeout: Number(process.env.MOPH_API_ACCESS_TOKEN_TIMEOUT),
    }
  );
  return resp.body;
}

async function getPatientImmunizationHistory(citizenId, token) {
  const resp = await got.get(
    `${process.env.MOPH_API_URL}/api/ImmunizationHistory?cid=${citizenId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      rejectUnauthorized: false,
      responseType: "json",
      timeout: Number(process.env.MOPH_API_ACCESS_TOKEN_TIMEOUT),
    }
  );
  return resp.body.result;
}

module.exports = {
  getPatientImmunizationHistory,
  getNewToken,
};
