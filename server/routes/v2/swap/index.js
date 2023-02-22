const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const getTokensRouter = require("./getTokens");
const getPriceRouter = require("./getPrice");
const getQuoteRouter = require("./getQuote");
const swapTXRouter = require("./swapTX");

router.use("/", getTokensRouter);
router.use("/", getPriceRouter);
router.use("/", getQuoteRouter);
router.use("/", swapTXRouter);

module.exports = router;
