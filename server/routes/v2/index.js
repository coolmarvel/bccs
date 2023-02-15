const router = require("express").Router();

const txRouter = require("./tx");
const swapRouter = require("./swap");
const accountRouter = require("./account");

router.use("/tx", txRouter);
router.use("/swap", swapRouter);
router.use("/account", accountRouter);

module.exports = router;
