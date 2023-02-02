const router = require("express").Router();

const setRouter = require("./set");
const createRouter = require("./create");
const updateRouter = require("./update");
const mnemonicRouter = require("./mnemonic");

router.use("/", setRouter);
router.use("/", createRouter);
router.use("/", updateRouter);
router.use("/", mnemonicRouter);

module.exports = router;
