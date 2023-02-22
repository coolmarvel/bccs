const { erc1155 } = require("@openzeppelin/wizard");

const { logger } = require("../../../utils/winston");

const createERC1155 = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ercDefault = {};
      ercDefault.name = params.name; // string
      ercDefault.uri = params.uri; // string
      ercDefault.supply = params.supply; // boolean
      ercDefault.burnable = params.burnable; // boolean
      ercDefault.mintable = params.mintable; // boolean
      ercDefault.updatableUri = params.updatableUri; // boolean
      ercDefault.access = params.access; // string (ownable, roles)
      ercDefault.upgradeable = params.upgradeable; // string (uups, transparent) or null
      ercDefault.info = params.info; // object info : { securityContract: string, license: string }

      const contract = erc1155.print(ercDefault);
      resolve(contract);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createERC1155;
