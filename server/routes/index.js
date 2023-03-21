const router = require("express").Router();
const basicAuth = require("express-basic-auth");

const { logger } = require("../utils/winston");
const { authorizer, getUnauthorizedResponse } = require("../utils/basicAuth");

const v1Router = require("./v1"); // contract
const v2Router = require("./v2"); // ethereum
const v3Router = require("./v3"); // bitcoin
const v4Router = require("./v4"); // customToken

router.use("/v1", v1Router);
router.use("/v2", v2Router);
router.use("/v3", v3Router);
router.use("/v4", v4Router);

// basicAuth({
//   unauthorizedResponse: getUnauthorizedResponse,
//   authorizer: authorizer,
//   authorizeAsync: true,
//   realm: "Imb4T3st4pp",
//   challenge: false,
// }),

router.get("/", (req, res) => {
  try {
    res.send({ message: "server-client connected" });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: "server-client ping check"
 *      description: "server-client ping check"
 *      tags: [Ping]
 *      responses:
 *        "200":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "server-client connected"
 */
