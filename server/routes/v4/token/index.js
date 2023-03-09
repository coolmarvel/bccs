const router = require("express").Router();

const importRouter = require("./import");

router.use("/", importRouter);

module.exports = router;
