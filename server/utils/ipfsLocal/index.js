const { create } = require("ipfs-http-client");

const client = create({ host: "127.0.0.1", port: "5001", protocol: "http" });

module.exports = client;
