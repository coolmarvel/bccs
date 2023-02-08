const router = require("express").Router();

const getRouter = require("./get");
const sendRouter = require("./send");

router.use("/", getRouter);
router.use("/", sendRouter);

module.exports = router;
