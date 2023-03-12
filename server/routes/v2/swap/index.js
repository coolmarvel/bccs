const router = require("express").Router();

const getTokensRouter = require("./getTokens");
const getPriceRouter = require("./getPrice");
const getQuoteRouter = require("./getQuote");
const swapTxRouter = require("./swapTx");

router.use("/", getTokensRouter);
router.use("/", getPriceRouter);
router.use("/", getQuoteRouter);
router.use("/", swapTxRouter);

const testRouter = require("./test");
router.use("/", testRouter);

module.exports = router;
