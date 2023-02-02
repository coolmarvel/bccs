const { create } = require("ipfs-http-client");
const { Buffer } = require("buffer");

const { INFURA_PROJECT_ID, INFURA_SECRET_KEY } = process.env;

const authorization =
  "Basic " +
  Buffer.from(INFURA_PROJECT_ID + ":" + INFURA_SECRET_KEY).toString("base64");

const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: { authorization: authorization },
});

module.exports = { client, authorization };
