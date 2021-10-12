import { sleep, check } from "k6";
import http from "k6/http";
import { Counter, Trend } from "k6/metrics";

const baseUrl = __ENV.API_URL;

const endpoints = {
  token: `${baseUrl}/token`,
  immunizationHistory: `${baseUrl}/api/ImmunizationHistory`,
};

const SLEEP_DURATION = 1; //Math.random() * 5 + 5;
export const options = {
  stages: [{ duration: "1m", target: 10 }],
};
let GetOauthTokenTrend = new Trend("Get Oauth Token");
let ErrorCount = new Counter("errors");

export default function () {
  let getOauthTokenRes = http.get(endpoints.token, {
    headers: {
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      connection: "keep-alive",
      "content-type": "application/json",
      host: "moph-proxy.princhealth.com",
      origin: baseUrl,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      accept: "application/json",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
    },
  });

  const success = check(getOauthTokenRes, {
    "status is 200": (r) => r.status === 200,
  });

  if (!success) {
    ErrorCount.add(1);
  }
  GetOauthTokenTrend.add(getOauthTokenRes.timings.duration);

  sleep(SLEEP_DURATION);
}
