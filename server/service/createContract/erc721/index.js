const { erc721 } = require("@openzeppelin/wizard");

const { logger } = require("../../../utils/winston");

const createERC721 = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ercDefault = {};
      ercDefault.name = params.name; // string
      ercDefault.votes = params.votes; // boolean
      ercDefault.symbol = params.symbol; // string
      ercDefault.baseUri = params.baseUri; // string
      ercDefault.mintable = params.mintable; // boolean
      ercDefault.pausable = params.pausable; // boolean
      ercDefault.burnable = params.burnable; // boolean
      ercDefault.uriStorage = params.uriStorage; // boolean
      ercDefault.enumerable = params.enumerable; // boolean
      ercDefault.incremental = params.incremental; // boolean
      ercDefault.access = params.access; // string (ownable, roles)
      ercDefault.upgradeable = params.upgradeable; // string (uups, transparent)
      ercDefault.info = params.info; // object info : { securityContract: string, license: string }

      const contract = erc721.print(ercDefault);
      resolve(contract);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createERC721;
