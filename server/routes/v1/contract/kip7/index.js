const router = require("express").Router();

const deployRouter = require("./deploy");

router.use("/", deployRouter);

module.exports = router;
