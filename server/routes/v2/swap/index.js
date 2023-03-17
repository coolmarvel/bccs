const router = require("express").Router();

const getWrapBalanceRouter = require("./getWrapBalance");
const getTokensRouter = require("./getTokens");
const widthrawRouter = require("./withdraw");
const getPriceRouter = require("./getPrice");
const getQuoteRouter = require("./getQuote");
const depositRouter = require("./deposit");
const swapTxRouter = require("./swapTx");

router.use("/", getWrapBalanceRouter);
router.use("/", getTokensRouter);
router.use("/", widthrawRouter);
router.use("/", getPriceRouter);
router.use("/", getQuoteRouter);
router.use("/", depositRouter);
router.use("/", swapTxRouter);

const testRouter = require("./test");
router.use("/", testRouter);

module.exports = router;
