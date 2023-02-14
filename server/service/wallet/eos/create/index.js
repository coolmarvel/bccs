const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const { Api, JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const ecc = require("eosjs-ecc");
const bip39 = require("bip39");
const axios = require("axios");

const rpc = new JsonRpc("https://kylin.eosargentina.io", { fetch });

const { logger } = require("../../../../utils/winston");

const createWallet = (mnemonic, chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic === undefined) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const privateKey = ecc.seedPrivate(seed);
        console.log(privateKey);

        resolve(true);
      } else {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const privateKey = ecc.seedPrivate(seed.toString("hex"));
        const publicKey = ecc.privateToPublic(privateKey);
        console.log(privateKey);
        console.log(publicKey);
        const signatureProvider = new JsSignatureProvider([privateKey]);
        const api = new Api({
          rpc,
          signatureProvider,
          textDecoder: new TextDecoder(),
          textEncoder: new TextEncoder(),
        });
        // const result = await api.transact(
        //   {
        //     actions: [
        //       {
        //         account: "eosio",
        //         name: "newaccount",
        //         authorization: [{ actor: "eosio", permission: "active" }],
        //         data: {
        //           creator: "eosio",
        //           name: "test",
        //           owner: {
        //             threshold: 1,
        //             keys: [{ key: publicKey, weight: 1 }],
        //             accounts: [],
        //             waits: [],
        //           },
        //           active: {
        //             threshold: 1,
        //             keys: [{ key: publicKey, weight: 1 }],
        //             accounts: [],
        //             waits: [],
        //           },
        //         },
        //       },
        //     ],
        //   },
        //   { blocksBehind: 3, expireSeconds: 30 }
        // );
        // console.log(result);

        resolve(true);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createWallet;
