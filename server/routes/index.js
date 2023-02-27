const router = require("express").Router();

const { logger } = require("../utils/winston");
const rpcUrl = require("../utils/rpc/rpcUrl");
const updateStatusOff = require("../utils/rpc/off");

const isValidChainId = require("../service/chainId");

router.get("/", async (req, res) => {
  try {
    const chainId = await isValidChainId(req);
    // const url = await rpcUrl(chainId);
    await updateStatusOff(chainId);

    res.send({ message: "server-client connected" });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

const v1Router = require("./v1");
const v2Router = require("./v2"); // ethereum
const v3Router = require("./v3"); // bitcoin
const v4Router = require("./v4"); // eos

router.use("/v1", v1Router);
router.use("/v2", v2Router);
router.use("/v3", v3Router);
router.use("/v4", v4Router);

module.exports = router;
