const router = require("express").Router();

const tokenRouter = require("./token");
const contractRouter = require("./contract");

router.use("/token", tokenRouter);
router.use("/contract", contractRouter);

module.exports = router;
