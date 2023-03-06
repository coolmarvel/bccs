const axios = require("axios");
const cheerio = require("cheerio");

const scanTX = (chainId, address, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      let to = [];
      let from = [];
      let $age = [];
      let txFee = [];
      let $block = [];
      let $inOut = [];
      let $value = [];
      let $txFee = [];
      let $method = [];
      let $txHash = [];
      let $address = [];
      let gasPrice = [];

      // 클레이튼 테스트넷
      if (chainId == "1001") {
        const result = await axios
          .get(
            `https://api-baobab-v3.scope.klaytn.com/v2/accounts/${address}/txs?page=${page}`
          )
          .then((response) => response.data.result);
        resolve(result);
      }
      // 클레이튼 메인넷
      else if (chainId == "8217") {
        const result = await axios
          .get(
            `https://api-cypress-v3.scope.klaytn.com/v2/accounts/${address}/txs?page=${page}`
          )
          .then((response) => response.data.result);

        resolve(result);
      }
      // 이더리움 세폴리아 테스트넷
      else if (chainId == "11155111") {
        await axios
          .get(`https://sepolia.etherscan.io/txs?a=${address}&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);
            const method = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txFee = $("table tbody tr td.small.text-muted");
            const txHashAndAddress = $("table tbody tr td a");

            txHashAndAddress.each((i, v) => {
              if (v.attribs.href.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href.includes("block")) {
                $block.push(v.attribs.href.replace("/block/", ""));
              }
              $address.push(v.attribs["data-clipboard-text"]);
            });

            age.each((i, v) => {
              $age.push(v.children[0].data);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            method.map((i, v) => {
              $method.push(v.attribs["data-bs-title"]);
            });

            txFee.map((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });
          });

        $address
          .filter((v) => {
            return v !== null && v !== undefined && v !== "";
          })
          .map((v, i) => {
            if (i % 2 == 0) {
              from.push(v);
            } else {
              to.push(v);
            }
          });

        $value = $method.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v);
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            block: $block[i],
            method: $inOut[i],
            age: $age[i],
            address: { from: from[i], to: to[i] },
            value: $value[i],
            txFee: txFee[i],
            gasPrice: gasPrice[i],
          };
          return form;
        });
        resolve(result);
      }
      // 이더리움 괴를리 테스트넷
      else if (chainId == "5") {
        await axios
          .get(`https://goerli.etherscan.io/txs?a=${address}&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);
            const method = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txFee = $("table tbody tr td.small.text-muted");
            const txHashAndAddress = $("table tbody tr td a");

            txHashAndAddress.each((i, v) => {
              if (v.attribs.href.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href.includes("block")) {
                $block.push(v.attribs.href.replace("/block/", ""));
              }
              $address.push(v.attribs["data-clipboard-text"]);
            });

            age.each((i, v) => {
              $age.push(v.children[0].data);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            method.map((i, v) => {
              $method.push(v.attribs["data-bs-title"]);
            });

            txFee.map((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });
          });

        $address
          .filter((v) => {
            return v !== null && v !== undefined && v !== "";
          })
          .map((v, i) => {
            if (i % 2 == 0) {
              from.push(v);
            } else {
              to.push(v);
            }
          });

        $value = $method.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v);
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            block: $block[i],
            method: $inOut[i],
            age: $age[i],
            address: { from: from[i], to: to[i] },
            value: $value[i],
            txFee: txFee[i],
            gasPrice: gasPrice[i],
          };
          return form;
        });
        resolve(result);
      }
      // 이더리움 메인넷
      else if (chainId == "1") {
        await axios
          .get(`https://etherscan.io/txs?a=${address}&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);
            const method = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txFee = $("table tbody tr td.small.text-muted");
            const txHashAndAddress = $("table tbody tr td a");

            txHashAndAddress.each((i, v) => {
              if (v.attribs.href.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href.includes("block")) {
                $block.push(v.attribs.href.replace("/block/", ""));
              }
              $address.push(v.attribs["data-clipboard-text"]);
            });

            age.each((i, v) => {
              $age.push(v.children[0].data);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            method.map((i, v) => {
              $method.push(v.attribs["data-bs-title"]);
            });

            txFee.map((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });
          });

        $address
          .filter((v) => {
            return v !== null && v !== undefined && v !== "";
          })
          .map((v, i) => {
            if (i % 2 == 0) {
              from.push(v);
            } else {
              to.push(v);
            }
          });

        $value = $method.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v);
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            block: $block[i],
            method: $inOut[i],
            age: $age[i],
            address: { from: from[i], to: to[i] },
            value: $value[i],
            txFee: txFee[i],
            gasPrice: gasPrice[i],
          };
          return form;
        });
        resolve(result);
      }
      // 폴리곤 테스트넷
      else if (chainId == "80001") {
        await axios
          .get(
            `https://mumbai.polygonscan.com/txs?a=0${address}&ps=50&p=${page}`
          )
          .then((response) => {
            const $ = cheerio.load(response.data);
            const method = $("div table tbody tr td");

            method.map((i, v) => {
              console.log(v.children[0].children);
            });
          });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            block: $block[i],
            method: $inOut[i],
            age: $age[i],
            address: { from: from[i], to: to[i] },
            value: $value[i],
            txFee: txFee[i],
            gasPrice: gasPrice[i],
          };
          return form;
        });
        resolve(result);
      }
      // 폴리곤 메인넷
      else if (chainId == "137") {
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = scanTX;
