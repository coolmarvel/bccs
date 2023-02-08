const router = require("express").Router();

const txRouter = require("./tx");
const accountRouter = require("./account");

router.use("/tx", txRouter);
router.use("/account", accountRouter);

module.exports = router;
