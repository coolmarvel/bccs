const fs = require("fs");

const { logger } = require("../../utils/winston");

const createFile = (name, contract) => {
  return new Promise(async (resolve, reject) => {
    fs.writeFile(`public/${name}.sol`, contract, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

const readFile = (name) => {
  return new Promise(async (resolve, reject) => {
    fs.readFile(`public/${name}.sol`, "utf8", (err, data) => {
      if (err) return reject(err);
      console.log(data);
      //   const source = JSON.parse(data);
      resolve(data);
    });
  });
};

const getFiles = () => {
  return new Promise(async (resolve, reject) => {
    fs.readdir("build/contracts", "utf8", (err, data) => {
      const source = data;
      if (err) return reject(err);
      resolve(source);
    });
  });
};

const getFile = (filename) => {
  return new Promise(async (resolve, reject) => {
    fs.readFile(`build/contracts/${filename}`, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const rmDir = () => {
  return new Promise(async (resolve, reject) => {
    fs.rm("build", { recursive: true }, (err, data) => {
      if (err) return reject(err);
      logger.info("build directory delete success");
      resolve(true);
    });
  });
};

module.exports = { rmDir, getFile, getFiles, createFile, readFile };
