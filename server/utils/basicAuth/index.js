const Auth = require("../../models/basicAuth");

const authorizer = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const auth = await Auth.findOne({
        where: { username: username, password: password },
        attributes: ["username", "password"],
      });

      if (username === auth.username && password === auth.password) {
        resolve(true);
      } else {
        return reject({
          message: `Credentials ${username} : ${password} Invalid Authorizer`,
        });
      }
    } catch (error) {
      console.error(error.message);
      return reject(error);
    }
  });
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
