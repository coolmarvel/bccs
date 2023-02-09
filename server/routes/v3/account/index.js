const router = require("express").Router();

const newRouter = require("./new");
const setRouter = require("./set");
const createRouter = require("./create");

router.use("/", newRouter);
router.use("/", setRouter);
router.use("/", createRouter);

module.exports = router;
