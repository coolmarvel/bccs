const router = require("express").Router();

const valueRouter = require("./value");

router.use("/value", valueRouter);

module.exports = router;
