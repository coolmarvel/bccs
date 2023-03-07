const router = require("express").Router();

const addRouter = require("./add");

router.use("/", addRouter);

module.exports = router;
