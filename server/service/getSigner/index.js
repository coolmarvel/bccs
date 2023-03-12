const ethers = require("ethers");

const getSigner = async (privateKey, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signer = new ethers.Wallet(privateKey, provider);

      resolve(signer);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getSigner;
