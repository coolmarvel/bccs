const router = require("express").Router();

const getTokensRouter = require("./getTokens");
const getPriceRouter = require("./getPrice");
const getQuoteRouter = require("./getQuote");
const swapTXRouter = require("./swapTX");
const swapRouter = require("./swap");

router.use("/", getTokensRouter);
router.use("/", getPriceRouter);
router.use("/", getQuoteRouter);
router.use("/", swapTXRouter);
router.use("/", swapRouter);

const testRouter = require("./test");
router.use("/", testRouter);

module.exports = router;
