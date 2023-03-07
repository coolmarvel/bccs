const router = require("express").Router();

const txRouter = require("./tx");
const swapRouter = require("./swap");
const scanRouter = require("./scan");
const accountRouter = require("./account");
const networkRouter = require("./network");

router.use("/tx", txRouter);
router.use("/swap", swapRouter);
router.use("/scan", scanRouter);
router.use("/account", accountRouter);
router.use("/network", networkRouter);

module.exports = router;
