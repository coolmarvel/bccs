const router = require("express").Router();

const addRouter = require("./add");
const createRouter = require("./create");
const updateRouter = require("./update");
const importRouter = require("./import");
const exportRouter = require("./export");
const mnemonicRouter = require("./mnemonic");

router.use("/", addRouter);
router.use("/", createRouter);
router.use("/", updateRouter);
router.use("/", importRouter);
router.use("/", exportRouter);
router.use("/", mnemonicRouter);

module.exports = router;
