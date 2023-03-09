const router = require("express").Router();

const contractRouter = require("./contract");

router.use("/contract", contractRouter);

module.exports = router;
