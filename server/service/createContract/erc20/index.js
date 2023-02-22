const { erc20 } = require("@openzeppelin/wizard");

const { logger } = require("../../../utils/winston");

const createERC20 = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ercDefault = {};
      ercDefault.name = params.name; // string
      ercDefault.votes = params.votes; // boolean
      ercDefault.symbol = params.symbol; // string
      ercDefault.permit = params.permit; // boolean
      ercDefault.premint = params.premint; // stringstr
      ercDefault.mintable = params.mintable; // boolean
      ercDefault.pausable = params.pausable; // boolean
      ercDefault.burnable = params.burnable; // boolean
      ercDefault.flashmint = params.flashmint; // boolean
      ercDefault.snapshots = params.snapshots; // boolean
      ercDefault.access = params.access; // string (ownable, roles)
      ercDefault.upgradeable = params.upgradeable; // string (uups, transparent) or null
      ercDefault.info = params.info; // object info : { securityContract: string, license: string }

      const contract = erc20.print(ercDefault);
      resolve(contract);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createERC20;
