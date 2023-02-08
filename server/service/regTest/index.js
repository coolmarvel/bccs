const { RegtestUtils } = require("regtest-client");

const APIPASS = "satoshi";
const APIURL = "https://regtest.bitbank.cc/1";

const regtestUtils = new RegtestUtils({ APIPASS, APIURL });

module.exports = regtestUtils;
