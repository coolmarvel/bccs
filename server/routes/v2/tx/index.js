const router = require("express").Router();

const valueRouter = require("./value");
const feeDelegateRouter = require("./feeDelegate");

router.use("/value", valueRouter);
router.use("/fd", feeDelegateRouter);

module.exports = router;
