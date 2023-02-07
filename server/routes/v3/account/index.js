const router = require("express").Router();

const setRouter = require("./set");
const createRouter = require("./create");

router.use("/", setRouter);
router.use("/", createRouter);

module.exports = router;
