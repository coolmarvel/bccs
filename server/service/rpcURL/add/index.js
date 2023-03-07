const axios = require("axios");

const addNetwork = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chains = await axios
        .get(`https://chainid.network/chains.json`)
        .then((response) => {
          let result;
          response.data.map((v, i) => {
            if (v.rpc.includes(url)) {
              result = v;
            }
          });

          return result;
        });
      console.log(chains);

      resolve(chains);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = addNetwork;
