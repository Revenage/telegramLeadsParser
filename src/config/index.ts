const config = {
  API_ID: Number(process.env.API_ID),
  API_HASH: process.env.API_HASH || "",
  LEADS: JSON.parse(process.env.LEADS || "[]"),
  COUNTRY_PHONE_CODE: process.env.COUNTRY_PHONE_CODE,
  USERNAME: process.env.USERNAME || "",
};

export default config;
