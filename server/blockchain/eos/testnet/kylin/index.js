const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require("node-fetch");
const ecc = require("eosjs-ecc");
const axios = require("axios");

const rpc = new JsonRpc("https://api.eosnewyork.io", { fetch });
const signatureProvider = new JsSignatureProvider([
  "5JZC5pmS1TgeuSN5tDZfQ1SEesyxzAA4zhyfpgzTVMFYKquknDL",
]);
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});
