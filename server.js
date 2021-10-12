const fastify = require("fastify");
const { getNewToken, getPatientImmunizationHistory } = require("./moph-sdk.js");

const fast = fastify({ logger: true });

// note(roy): response is mimicking the response from the MOPH API
fast.get("/token", async (request, reply) => {
  return await getNewToken();
});

fast.get("/api/ImmunizationHistory", async (request, reply) => {
  return {
    result: await getPatientImmunizationHistory(
      request.query.cid,
      await getNewToken()
    ),
  };
});

// Run the server!
const start = async () => {
  try {
    await fast.listen(process.env.SERVER_PORT || 3000);
  } catch (err) {
    fast.log.error(err);
    process.exit(1);
  }
};
start();
