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
            `https://mumbai.polygonscan.com/txs?a=${address}&ps=50&p=${page}`
          )
          .then((response) => {
            const $ = cheerio.load(response.data);

            const txHash = $("table tbody tr td span a");
            const age = $("table tbody tr td.showAge span");
            const inOut = $("table tbody tr td.text-center");
            const txFee = $("table tbody tr td.small.text-muted");
            const method = $("table tbody tr td span.u-label");
            const newCon = $("table tbody tr td a.hash-tag.text-truncate");

            txHash.map((i, v) => {
              if (v.attribs.href.includes("tx")) {
                $txHash.push(v.attribs.href.replace("/tx/", ""));
              }
              if (v.attribs.href.includes("block")) {
                $block.push(v.attribs.href.replace("/block/", ""));
              }
              if (v.attribs.href.includes("address")) {
                $address.push(v.attribs.href.replace("/address/", ""));
              }
            });

            age.each((i, v) => {
              $age.push(v.children[0].data);
            });

            inOut.each((i, v) => {
              $inOut.push(v.children[0].children[0].data);
            });

            newCon.each((i, v) => {
              // console.log(v.attribs.href);
              $newCon.push(v.attribs.href.replace("/address/", ""));
            });

            txFee.each((i, v) => {
              $txFee.push(
                `${v.children[0].data}.${v.children[0].next?.next?.data}`
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
        console.log($newCon);

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
            to.push("");
          }
        });

        console.log($inOut.length);
        console.log($newCon.length);
        console.log($address);

        // $address.map((v, i) => {
        //   if ($inOut[i].includes("IN") && $method[i].includes("Transfer")) {
        //     console.log("1", i);
        //     from.push(v);
        //     to.push(address);
        //   }
        //   if ($inOut[i].includes("OUT") && $method[i].includes("0x")) {
        //     console.log("2", i);
        //     from.push(v);
        //     to.push("");
        //   }
        //   if ($inOut[i].includes("OUT") && !$method[i].includes("0x")) {
        //     console.log("3", i);
        //     from.push(address);
        //     to.push(v);
        //   }
        // });

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
            method: $method[i],
            age: $age[i],
            inOut: $inOut[i],
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
