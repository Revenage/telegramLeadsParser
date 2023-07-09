const config = {
  API_ID: Number(process.env.API_ID),
  API_HASH: process.env.API_HASH || "",
  LEADS: JSON.parse(process.env.LEADS || "[]"),
  USERNAME: process.env.USERNAME || "",
  PHONE_NUMBER: process.env.PHONE_NUMBER || "",
};

export default config;
