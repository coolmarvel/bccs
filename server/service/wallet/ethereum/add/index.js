const bip39 = require("bip39");
const { v4 } = require("uuid");
const crypto = require("crypto");
const { hdkey } = require("ethereumjs-wallet");

const getCaver = require("../../../getCaver");

const { logger } = require("../../../../utils/winston");

const addWallet = (mnemonic, hdPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve();
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = addWallet;
