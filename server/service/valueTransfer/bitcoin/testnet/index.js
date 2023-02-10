const bitcore = require("bitcore-lib");

const rb = bitcore.crypto.Random.getRandomBuffer(32);
const rn = bitcore.crypto.BN.fromBuffer(rb);

const address = new bitcore.PrivateKey(rn).toAddress("testnet");
console.log(address.toString()); // mz2bHt4B5jnVoWnTj7aZHkuHKypjbcfz9L

const wif = bitcore.PrivateKey("testnet").toWIF();
const privateKeyWIF = "cPb73RjX57ExAqZ7Hkq2xUjPLBKUqnx3uZjZYwemkcdxELz9Vhep";

const privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
console.log(privateKey.toString());
const address1 = privateKey.toAddress();
console.log(address1.toString());
