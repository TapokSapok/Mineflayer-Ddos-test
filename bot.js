const mineflayer = require("mineflayer");
const { parentPort, workerData } = require("node:worker_threads");
const cl = require("colors");
const { ProxyAgent } = require("proxy-agent");
const socks = require("socks").SocksClient;

const { username, proxy } = workerData;

class Bot {
  constructor() {
    this.bot = mineflayer.createBot({
      host: "solar.minerent.net",
      port: 25573,
      username: username,
      version: "1.20.1",
      physicsEnabled: false,
      agent: new ProxyAgent({ protocol: "socks5:", host: proxy[0], port: parseInt(proxy[1]) }),
      connect: (client) => {
        socks.createConnection(
          {
            proxy: {
              host: proxy[0],
              port: parseInt(proxy[1]),
              type: 5,
            },
            command: "connect",
            destination: {
              host: "solar.minerent.net",
              port: 25573,
            },
          },
          (err, info) => {
            if (err) {
              console.log(cl.red("Ошибка подключения прокси", proxy));
              return;
            }
            client.setSocket(info.socket);
            client.emit("connect");
          }
        );
      },
    });

    this.bot.on("messagestr", (msg) => {
      console.log(msg);
      if (msg.includes("/login")) this.bot.chat("/login famo123123");
      else if (msg.includes("/register")) this.bot.chat("/register famo123123 famo123123");
    });

    this.bot.on("kicked", (r) => {
      parentPort.postMessage({ type: "kicked", msg: r });
      console.log(username, cl.red("KICKED"), r);
    });
    this.bot.on("error", (e) => {
      console.log(username, cl.red("ERROR"));
      parentPort.postMessage({ type: "error", msg: e });
    });

    this.bot.once("spawn", async () => {
      await this.bot.waitForTicks(20);
      setInterval(() => this.bot.chat("ALLAXACBAR"), 4000);
    });
  }
}

new Bot();
