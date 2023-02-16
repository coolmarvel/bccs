const Web3 = require("web3");
const ganache = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:7545")
);

module.exports = ganache;
