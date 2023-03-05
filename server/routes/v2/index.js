const router = require("express").Router();

const txRouter = require("./tx");
const swapRouter = require("./swap");
const scanRouter = require("./scan");
const accountRouter = require("./account");

router.use("/tx", txRouter);
router.use("/swap", swapRouter);
router.use("/scan", scanRouter);
router.use("/account", accountRouter);

module.exports = router;
