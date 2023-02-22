const router = require("express").Router();

const kip7Router = require("./kip7");
const kip17Router = require("./kip17");
const kip37Router = require("./kip37");
const wizardRotuer = require("./wizard");

router.use("/ft", kip7Router);
router.use("/mt", kip37Router);
router.use("/nft", kip17Router);
router.use("/wizard", wizardRotuer);

module.exports = router;
