const Mnemonic = require("eth-lightwallet/node_modules/bitcore-mnemonic");
const lightWallet = require("eth-lightwallet");

const { logger } = require("../../../../utils/winston");

const { PASSWORD } = process.env;

const createWallet = (mnemonic, password) => {
  try {
    const entropy = new Mnemonic(Mnemonic.Words.ENGLISH);
    const seedPhrase = entropy.toString();

    return new Promise((resolve, reject) => {
      // mnemonic, password 둘 다 없을 때
      if (mnemonic === undefined && password === undefined) {
        password = PASSWORD;
        lightWallet.keystore.createVault(
          { password, seedPhrase, hdPathString: "m/44'/60'/0'/0" },
          (err, ks) => {
            if (err) {
              return reject(err);
            }

            ks.keyFromPassword(password, (err, pwDerivedKey) => {
              if (err) {
                return reject(err);
              }

              ks.generateNewAddress(pwDerivedKey);
              const addresses = ks.getAddresses();
              const address = addresses[0];
              const privateKey = ks.exportPrivateKey(address, pwDerivedKey);

              resolve({ address, privateKey, seedPhrase });
            });
          }
        );
      } else {
        // mnemonic, password 둘 다 있을 때
        if (mnemonic && password) {
          lightWallet.keystore.createVault(
            { password, seedPhrase: mnemonic, hdPathString: "m/44'/60'/0'/0" },
            (err, ks) => {
              if (err) {
                return reject(err);
              }

              ks.keyFromPassword(password, (err, pwDerivedKey) => {
                if (err) {
                  return reject(err);
                }

                ks.generateNewAddress(pwDerivedKey);
                const addresses = ks.getAddresses();
                const address = addresses[0];
                const privateKey = ks.exportPrivateKey(address, pwDerivedKey);

                resolve({ address, privateKey, seedPhrase: mnemonic });
              });
            }
          );
        }
        // menmonic은 있고 password가 없을 때
        else if (mnemonic && password === undefined) {
          password = PASSWORD;
          lightWallet.keystore.createVault(
            {
              password,
              seedPhrase: mnemonic,
              hdPathString: "m/44'/60'/0'/0",
            },
            (err, ks) => {
              if (err) {
                return reject(err);
              }

              ks.keyFromPassword(password, (err, pwDerivedKey) => {
                if (err) {
                  return reject(err);
                }

                ks.generateNewAddress(pwDerivedKey);
                const addresses = ks.getAddresses();
                const address = addresses[0];
                const privateKey = ks.exportPrivateKey(address, pwDerivedKey);

                resolve({ address, privateKey, seedPhrase: mnemonic });
              });
            }
          );
        }
      }
    });
  } catch (error) {
    logger.error(error.message);
    return reject(error);
  }
};

module.exports = createWallet;
