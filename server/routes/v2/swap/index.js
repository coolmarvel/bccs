const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const { ethers } = require("ethers");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
// const { getPoolImmutables, getPoolState } = require("./helpers");
const ERC20ABI = require("../../../../build/baobab/contracts/ERC20.json");

const provider = new ethers.JsonRpcProvider("https://api.baobab.klaytn.net:8651");

router.post("/", async (req, res) => {
  try {
    res.send({ message: IUniswapV3PoolABI });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
