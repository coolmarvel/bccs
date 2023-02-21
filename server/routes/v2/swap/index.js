const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const axios = require("axios");

const getPrice = require("../../../service/swap/getPrice");
const getQuote = require("../../../service/swap/getQuote");

router.post("/", async (req, res) => {
  try {
    const { from, to, value } = req.body;

    // const accounts = await ganache.eth.accounts.wallet.add(privateKey);

    // let currentTrade = {};
    // let currentSelectSide = {};
    // let tokens = await axios
    //   .get("https://tokens.coingecko.com/uniswap/all.json")
    //   .then((response) => {
    //     return response.data.tokens;
    //   });

    const price = await getPrice(
      {
        chainId: 1,
        address: "0x418d75f65a02b3d53b2418fb8e1fe493759c7605",
        name: "Binance Coin  Wormhole ",
        symbol: "BNB",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/22884/thumb/BNB_wh_small.png?1644224553",
      },
      {
        chainId: 1,
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        name: "Polygon",
        symbol: "MATIC",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
      },
      1
    );

    const quote = await getQuote(
      {
        chainId: 1,
        address: "0x418d75f65a02b3d53b2418fb8e1fe493759c7605",
        name: "Binance Coin  Wormhole ",
        symbol: "BNB",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/22884/thumb/BNB_wh_small.png?1644224553",
      },
      {
        chainId: 1,
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        name: "Polygon",
        symbol: "MATIC",
        decimals: 18,
        logoURI:
          "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912",
      },
      1
    );

    res.send({ price, quote });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
