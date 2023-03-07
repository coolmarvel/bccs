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
      let $newCon = [];
      let $method = [];
      let $txHash = [];
      let $address = [];
      let gasPrice = [];
      let $gasPrice = [];

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
          .get(`https://sepolia.etherscan.io/txs?a=${address}&ps=50&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);

            const value = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txHashAndAddress = $("table tbody tr td a");
            const method = $("table tbody tr td span.d-block");
            const txFee = $("table tbody tr td.small.text-muted");

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
              $age.push(v.attribs["data-bs-title"]);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            value.each((i, v) => {
              $value.push(v.attribs["data-bs-title"]);
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
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

        $value = $value.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v.replace(".undefined", ""));
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            blockNumber: $block[i],
            methodName: $method[i],
            inOut: $inOut[i],
            createdAt: $age[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
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

            const value = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txHashAndAddress = $("table tbody tr td a");
            const method = $("table tbody tr td span.d-block");
            const txFee = $("table tbody tr td.small.text-muted");

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
              $age.push(v.attribs["data-bs-title"]);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            value.each((i, v) => {
              $value.push(v.attribs["data-bs-title"]);
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
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

        $value = $value.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v.replace(".undefined", ""));
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            blockNumber: $block[i],
            methodName: $method[i],
            inOut: $inOut[i],
            createdAt: $age[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
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

            const value = $("table tbody tr td span");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txHashAndAddress = $("table tbody tr td a");
            const method = $("table tbody tr td span.d-block");
            const txFee = $("table tbody tr td.small.text-muted");

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
              $age.push(v.attribs["data-bs-title"]);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            value.each((i, v) => {
              $value.push(v.attribs["data-bs-title"]);
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
              );
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
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

        $value = $value.filter((v) => {
          return v !== null && v !== undefined && v.includes("ETH");
        });

        $txFee.map((v, i) => {
          if (i % 2 == 0) {
            txFee.push(v);
          } else {
            gasPrice.push(v.replace(".undefined", ""));
          }
        });

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            blockNumber: $block[i],
            methodName: $method[i],
            inOut: $inOut[i],
            createdAt: $age[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
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
            `https://mumbai.polygonscan.com/txs?a=${address}&ps=50&p=${page}`
          )
          .then((response) => {
            const $ = cheerio.load(response.data);

            const value = $("table tbody tr td");
            const block = $("table tbody tr td a");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const method = $("table tbody tr td span.u-label");
            const txFee = $(
              "table tbody tr td.showTxnFee span.small.text-secondary"
            );
            const gasPrice = $(
              "table tbody tr td.showGasPrice span.small.text-secondary"
            );
            const newCon = $("table tbody tr td a.hash-tag.text-truncate");

            block.each((i, v) => {
              if (v.attribs.href?.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href?.includes("block")) {
                $block.push(v.attribs.href?.replace("/block/", ""));
              }
              if (v.attribs.href?.includes("address")) {
                $address.push(v.attribs.href.replace("/address/", ""));
              }
            });

            age.each((i, v) => {
              $age.push(v.attribs.title);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data.replace(" IN ", "IN"));
            });

            value.each((i, v) => {
              let result = `${v.children[0].data}.${v.children[0]?.next?.next.data}`;
              if (result.includes("MATIC")) {
                $value.push(result.replace(".undefined", ""));
              }
            });

            newCon.each((i, v) => {
              $newCon.push(v.attribs.href.replace("/address/", ""));
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            gasPrice.each((i, v) => {
              $gasPrice.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title?.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
              );
            });
          });

        $method = $method.filter((v) => {
          return v !== undefined && v !== null && v !== "";
        });

        $method.map((v, i) => {
          if (v.includes("Transfer") && $inOut[i].includes("IN")) {
            from.push($address[i]);
            to.push(address);
          }
          if (v.includes("Transfer") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push($address[i]);
          }
          if (v.includes("0x") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push("contract");
          }
        });

        let index = [];
        for (let i = 0; i < to.length; i++) {
          if (to[i] === "contract") {
            index.push(i);
          }
        }
        for (let i = 0; i < $newCon.length; i++) {
          to[index[i]] = $newCon[i];
        }

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            methodName: $method[i],
            blockNumber: $block[i],
            createdAt: $age[i],
            inOut: $inOut[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
            txFee: $txFee[i],
            gasPrice: $gasPrice[i],
          };
          return form;
        });

        resolve(result);
      }
      // 폴리곤 메인넷
      else if (chainId == "137") {
        await axios
          .get(`https://polygonscan.com/txs?a=${address}&ps=50&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);

            const value = $("table tbody tr td");
            const block = $("table tbody tr td a");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const method = $("table tbody tr td span.u-label");
            const txFee = $(
              "table tbody tr td.showTxnFee span.small.text-secondary"
            );
            const gasPrice = $(
              "table tbody tr td.showGasPrice span.small.text-secondary"
            );
            const newCon = $("table tbody tr td a.hash-tag.text-truncate");

            block.each((i, v) => {
              if (v.attribs.href?.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href?.includes("block")) {
                $block.push(v.attribs.href?.replace("/block/", ""));
              }
              if (v.attribs.href?.includes("address")) {
                $address.push(v.attribs.href.replace("/address/", ""));
              }
            });

            age.each((i, v) => {
              $age.push(v.attribs.title);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data.replace(" IN ", "IN"));
            });

            value.each((i, v) => {
              let result = `${v.children[0].data}.${v.children[0]?.next?.next.data}`;
              if (result.includes("MATIC")) {
                $value.push(result.replace(".undefined", ""));
              }
            });

            newCon.each((i, v) => {
              $newCon.push(v.attribs.href.replace("/address/", ""));
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            gasPrice.each((i, v) => {
              $gasPrice.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title?.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
              );
            });
          });

        $method = $method.filter((v) => {
          return v !== undefined && v !== null && v !== "";
        });

        $method.map((v, i) => {
          if (v.includes("Transfer") && $inOut[i].includes("IN")) {
            from.push($address[i]);
            to.push(address);
          }
          if (v.includes("Transfer") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push($address[i]);
          }
          if (v.includes("0x") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push("contract");
          }
        });

        let index = [];
        for (let i = 0; i < to.length; i++) {
          if (to[i] === "contract") {
            index.push(i);
          }
        }
        for (let i = 0; i < $newCon.length; i++) {
          to[index[i]] = $newCon[i];
        }

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            methodName: $method[i],
            blockNumber: $block[i],
            createdAt: $age[i],
            inOut: $inOut[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
            txFee: $txFee[i],
            gasPrice: $gasPrice[i],
          };
          return form;
        });

        resolve(result);
      }
      // 바이낸스 테스트넷
      else if (chainId == "97") {
        await axios
          .get(`https://testnet.bscscan.com/txs?a=${address}&ps=50&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);

            const value = $("table tbody tr td");
            const block = $("table tbody tr td a");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const method = $("table tbody tr td span.u-label");
            const txFee = $(
              "table tbody tr td.showTxnFee span.small.text-secondary"
            );
            const gasPrice = $(
              "table tbody tr td.showGasPrice span.small.text-secondary"
            );
            const newCon = $("table tbody tr td a.hash-tag.text-truncate");

            block.each((i, v) => {
              if (v.attribs.href?.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href?.includes("block")) {
                $block.push(v.attribs.href?.replace("/block/", ""));
              }
              if (v.attribs.href?.includes("address")) {
                $address.push(v.attribs.href.replace("/address/", ""));
              }
            });

            age.each((i, v) => {
              $age.push(v.attribs.title);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data.replace(" IN ", "IN"));
            });

            value.each((i, v) => {
              let result = `${v.children[0].data}.${v.children[0]?.next?.next.data}`;
              if (result.includes("BNB")) {
                $value.push(result.replace(".undefined", ""));
              }
            });

            newCon.each((i, v) => {
              $newCon.push(v.attribs.href.replace("/address/", ""));
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            gasPrice.each((i, v) => {
              $gasPrice.push(`${v.children[0].data}`);
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title?.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
              );
            });
          });

        $method = $method.filter((v) => {
          return v !== undefined && v !== null && v !== "";
        });

        $method.map((v, i) => {
          if (v.includes("Transfer") && $inOut[i].includes("IN")) {
            from.push($address[i]);
            to.push(address);
          }
          if (v.includes("Transfer") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push($address[i]);
          }
          if (v.includes("0x") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push("contract");
          }
        });

        let index = [];
        for (let i = 0; i < to.length; i++) {
          if (to[i] === "contract") {
            index.push(i);
          }
        }
        for (let i = 0; i < $newCon.length; i++) {
          to[index[i]] = $newCon[i];
        }

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            methodName: $method[i],
            blockNumber: $block[i],
            createdAt: $age[i],
            inOut: $inOut[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
            txFee: $txFee[i],
            gasPrice: $gasPrice[i],
          };
          return form;
        });

        resolve(result);
      }
      // 바이낸스 메인넷
      else if (chainId == "56") {
        await axios
          .get(`https://bscscan.com/txs?a=${address}&ps=50&p=${page}`)
          .then((response) => {
            const $ = cheerio.load(response.data);

            const value = $("table tbody tr td");
            const block = $("table tbody tr td a");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const method = $("table tbody tr td span.u-label");
            const txFee = $(
              "table tbody tr td.showTxnFee span.small.text-secondary"
            );
            const gasPrice = $(
              "table tbody tr td.showGasPrice span.small.text-secondary"
            );
            const newCon = $("table tbody tr td a.hash-tag.text-truncate");

            block.each((i, v) => {
              if (v.attribs.href?.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href?.includes("block")) {
                $block.push(v.attribs.href?.replace("/block/", ""));
              }
              if (v.attribs.href?.includes("address")) {
                $address.push(v.attribs.href.replace("/address/", ""));
              }
            });

            age.each((i, v) => {
              $age.push(v.attribs.title);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data.replace(" IN ", "IN"));
            });

            value.each((i, v) => {
              let result = `${v.children[0].data}.${v.children[0]?.next?.next.data}`;
              if (result.includes("BNB")) {
                $value.push(result.replace(".undefined", ""));
              }
            });

            newCon.each((i, v) => {
              $newCon.push(v.attribs.href.replace("/address/", ""));
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next.data}`
              );
            });

            gasPrice.each((i, v) => {
              $gasPrice.push(`${v.children[0].data}`);
            });

            method.each((i, v) => {
              $method.push(
                v.attribs.title?.replace(
                  "This transaction includes data in the Input Data field which may indicate a message in UTF-8",
                  "Transfer*"
                )
              );
            });
          });

        $method = $method.filter((v) => {
          return v !== undefined && v !== null && v !== "";
        });

        $method.map((v, i) => {
          if (v.includes("Transfer") && $inOut[i].includes("IN")) {
            from.push($address[i]);
            to.push(address);
          }
          if (v.includes("Transfer") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push($address[i]);
          }
          if (v.includes("0x") && $inOut[i].includes("OUT")) {
            from.push(address);
            to.push("contract");
          }
        });

        let index = [];
        for (let i = 0; i < to.length; i++) {
          if (to[i] === "contract") {
            index.push(i);
          }
        }
        for (let i = 0; i < $newCon.length; i++) {
          to[index[i]] = $newCon[i];
        }

        const result = $txHash.map((v, i) => {
          const form = {
            txHash: v,
            methodName: $method[i],
            blockNumber: $block[i],
            createdAt: $age[i],
            inOut: $inOut[i],
            fromAddress: from[i],
            toAddress: to[i],
            amount: $value[i],
            txFee: $txFee[i],
            gasPrice: $gasPrice[i],
          };
          return form;
        });

        resolve(result);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = scanTX;
