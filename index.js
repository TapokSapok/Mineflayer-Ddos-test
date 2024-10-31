const { Worker } = require("node:worker_threads");
const cl = require("colors");
const fs = require("fs");
const { SocksProxyAgent } = require("socks-proxy-agent");

const proxies = fs
  .readFileSync("proxies.txt", "utf-8")
  .split("\r\n")
  .map((p) => p.split("//")[1].split(":"));

const username = "SUKA";
const startCount = 200;

const main = async () => {
  for (let i = 0; i < startCount; i++) {
    const proxy = proxies[i % proxies.length];
    console.log(i % proxies.length);
    const bUsername = username + `_` + i;
    const worker = new Worker("./src/bot.js", {
      workerData: { username: bUsername, proxy },
    });

    console.log(`Запуск ${bUsername}`);
  }
};

main();
