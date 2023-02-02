const router = require("express").Router();

const getRouter = require("./get");
const sendRouter = require("./send");
const estimateRouter = require("./estimate");

router.use("/", getRouter);
router.use("/", sendRouter);
router.use("/", estimateRouter);

module.exports = router;
