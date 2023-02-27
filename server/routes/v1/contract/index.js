const router = require("express").Router();

const erc20Router = require("./erc20");
const erc721Router = require("./erc721");
const erc1155Router = require("./erc1155");

router.use("/ft", erc20Router);
router.use("/nft", erc721Router);
router.use("/mt", erc1155Router);

module.exports = router;
