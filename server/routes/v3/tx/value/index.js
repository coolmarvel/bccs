const router = require("express").Router();

const getRouter = require("./get");
const sendRouter = require("./send");
const utxosRouter = require("./utxos");

router.use("/", getRouter);
router.use("/", sendRouter);
router.use("/", utxosRouter);

module.exports = router;
