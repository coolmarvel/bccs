const router = require("express").Router();

const erc20Router = require("./erc20");
const erc721Router = require("./erc721");
const erc1155Router = require("./erc1155");

router.use("/", erc20Router);
router.use("/", erc721Router);
router.use("/", erc1155Router);

module.exports = router;
