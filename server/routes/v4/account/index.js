const router = require("express").Router();

const createRouter = require("./create");

router.use("/", createRouter);

module.exports = router;
