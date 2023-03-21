const Auth = require("../../models/basicAuth");

const authorizer = async (username, password, cb) => {
  try {
    const auth = await Auth.findOne({
      where: { username: username, password: password },
      attributes: ["username", "password"],
    });

    if (username === auth.username && password === auth.password) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  } catch (error) {
    logger.error(error);
    return cb(null, false);
  }
};

const getUnauthorizedResponse = (req) => {
  return req.auth
    ? "Credentials " +
        req.auth.user +
        ":" +
        req.auth.password +
        " Invalid Authorizer"
    : "No credentials provided";
};

module.exports = { authorizer, getUnauthorizedResponse };
