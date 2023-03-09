const router = require("express").Router();

const tokenRouter = require("./token");

router.use("/token", tokenRouter);

module.exports = router;
