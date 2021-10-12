const { getNewToken, getPatientImmunizationHistory } = require("./moph-sdk.js");

async function run() {
  try {
    console.log(await getNewToken());

    const token = await getNewToken();

    const history = await getPatientImmunizationHistory("4101600003666", token);

    console.log(history);
  } catch (err) {
    console.error(err);
  }
}

run();
