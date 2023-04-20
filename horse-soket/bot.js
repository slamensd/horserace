const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { clearInterval } = require("timers");
const io = new Server(server);
const mongoose = require("mongoose");

const connectMongo = async () => mongoose.connect("enter your mongo db url");

connectMongo();

const HistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  winnerHorse: {
    type: String,
    required: true,
  },
  placements: {
    type: Array,
    line: {
      type: Number,
      required: true,
    },
    horse: {
      type: String,
      required: true,
    },
  },
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  pass1: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  pass2: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  deposit: {
    type: Number,
    required: false,
    default: 0,
  },
  img: {
    type: String,
    required: true,
    default: "default some image url",
  },
  admin: {
    type: Boolean,
    required: false,
    default: false,
  },
  newPassToken: {
    type: String,
    required: false,
    default: "",
  },
  userToken: {
    type: String,
    required: true,
  },
  maticBalance: {
    type: Number,
    required: false,
    default: 0,
  },
  walletAddress: {
    type: String,
    required: true,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
});

const GameSchema = new mongoose.Schema({
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
});

const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const History =
  mongoose.models.History || mongoose.model("History", HistorySchema);

var horse = [0, 0, 0, 0, 0];
var time = 10;
var raceTime = 30 * 1000;
var oranlar = [1.25, 1.5, 1.75, 2.0, 2.5];
var status = false;
restart();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  setTimeout(() => {
    io.emit("time", time);
    io.emit("status", status);
    io.emit("horse1Orana", oranlar[0]);
    io.emit("horse2Orana", oranlar[1]);
    io.emit("horse3Orana", oranlar[2]);
    io.emit("horse4Orana", oranlar[3]);
    io.emit("horse5Orana", oranlar[4]);
  }, 1000);
});

function rasteleSembol(uzunluk, semboller) {
  var maske = "";
  if (semboller.indexOf("a") > -1) maske += "abcdefghijklmnopqrstuvwxyz";
  if (semboller.indexOf("A") > -1) maske += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (semboller.indexOf("0") > -1) maske += "0123456789";
  if (semboller.indexOf("#") > -1)
    maske += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
  var sonuc = "";

  for (var i = uzunluk; i > 0; --i) {
    sonuc += maske[Math.floor(Math.random() * maske.length)];
  }
  return sonuc;
}

function bot() {
  const time = 60;
  const maxBet = 200;
  const minBet = 10;
  const maxBetMiktarı = 100;
  const minBetMiktarı = 10;
  const horse = ["Chief", "Magic", "Scout", "Rebel", "Lucky"];

  const betMiktari = Math.floor(Math.random() * (maxBet - minBet + 1) + minBet);
  for (let i = 0; i < betMiktari; i++) {
    const betTime = Math.floor(Math.random() * (time * 1000 - 1000 + 1) + 1000);
    const selectedSide = horse[Math.floor(Math.random() * horse.length)];
    setTimeout(async () => {
      await Game.create({
        userToken: "bot",
        username: rasteleSembol(8, "aA"),
        img: "enter some image url",
        betAmount: Math.floor(
          Math.random() * (maxBetMiktarı - minBetMiktarı + 1) + minBetMiktarı
        ),
        selectedSide: selectedSide,
      });
    }, betTime);
  }
}

function randomHorse() {
  const random5 = Math.floor(Math.random() * 100) + 1;
  const random1 = Math.floor(Math.random() * 100) + 1;
  const random2 = Math.floor(Math.random() * 100) + 1;
  const random3 = Math.floor(Math.random() * 100) + 1;
  const random4 = Math.floor(Math.random() * 100) + 1;
  total = random1 + random2 + random3 + random4 + random5;
  const yuzde1 = parseFloat((random1 * 100).toFixed(2));
  const yuzde2 = parseFloat((random2 * 100).toFixed(2));
  const yuzde3 = parseFloat((random3 * 100).toFixed(2));
  const yuzde4 = parseFloat((random4 * 100).toFixed(2));
  const yuzde5 = parseFloat((random5 * 100).toFixed(2));

  const oranToplam = yuzde1 + yuzde2 + yuzde3 + yuzde4 + yuzde5;
  const oran1 = (100 - yuzde1) / 25;
  const oran2 = (100 - yuzde2) / 25;
  const oran3 = (100 - yuzde3) / 25;
  const oran4 = (100 - yuzde4) / 25;
  const oran5 = (100 - yuzde5) / 25;

  horse = [
    {
      id: 1,
      yuzde: yuzde1,
      oran: oran1,
    },
    {
      id: 2,
      yuzde: yuzde2,
      oran: oran2,
    },
    {
      id: 3,
      yuzde: yuzde3,
      oran: oran3,
    },
    {
      id: 4,
      yuzde: yuzde4,
      oran: oran4,
    },
    {
      id: 5,
      yuzde: yuzde5,
      oran: oran5,
    },
  ];
}

function restart() {
  bot();
  var value = 1;
  oranlar = oranlar.sort(() => Math.random() - 0.5);
  io.emit("horse1Orana", oranlar[0]);
  io.emit("horse2Orana", oranlar[1]);
  io.emit("horse3Orana", oranlar[2]);
  io.emit("horse4Orana", oranlar[3]);
  io.emit("horse5Orana", oranlar[4]);
  console.log(oranlar);

  status = false;
  io.emit("status", false);
  time = 60;
  //100-0 random number
  randomHorse();

  io.emit("random", horse);

  var timer = setInterval(() => {
    time = time - 1;
    io.emit("time", time);

    if (time == 0) {
      clearInterval(timer);
      if (value == 1) {
        value = 0;
        game();
      }
    }
  }, 1000);
}

function wait() {
  setTimeout(() => {
    restart();
  }, 5000);
}

horseStatus = [0, 0, 0, 0, 0];

function game() {
  console.log("Race Started!!");
  status = true;
  io.emit("status", true);
  raceTime = 30 * 1000;
  horseStatus = [0, 0, 0, 0, 0];

  var race = setInterval(() => {
    raceTime -= 100;
    if (raceTime == 0) {
      clearInterval(race);
      wait();
    } else {
      const timer = ((30000 - raceTime) / 300) * 1;

      if (timer > 20 && timer < 21) {
        randomHorse();
      } else if (timer > 40 && timer < 41) {
        randomHorse();
      } else if (timer > 60 && timer < 61) {
        randomHorse();
      } else if (timer > 80 && timer < 81) {
        randomHorse();
      } else if (timer > 90 && timer < 91) {
        randomHorse();
      }

      const run1 = Math.random() * horse[0].yuzde + 1;
      const run2 = Math.random() * horse[1].yuzde + 1;
      const run3 = Math.random() * horse[2].yuzde + 1;
      const run4 = Math.random() * horse[3].yuzde + 1;
      const run5 = Math.random() * horse[4].yuzde + 1;

      horseStatus[0] += run1;
      horseStatus[1] += run2;
      horseStatus[2] += run3;
      horseStatus[3] += run4;
      horseStatus[4] += run5;

      const max = Math.max(
        horseStatus[0],
        horseStatus[1],
        horseStatus[2],
        horseStatus[3],
        horseStatus[4]
      );
      const yuzdelikValue = timer / max;

      const runner1 = horseStatus[0] * yuzdelikValue;
      const runner2 = horseStatus[1] * yuzdelikValue;
      const runner3 = horseStatus[2] * yuzdelikValue;
      const runner4 = horseStatus[3] * yuzdelikValue;
      const runner5 = horseStatus[4] * yuzdelikValue;

      const maxR = Math.max(runner1, runner2, runner3, runner4, runner5);
      const winList = [
        {
          name: "Chief",
          runner: runner1,
        },
        {
          name: "Magic",
          runner: runner2,
        },
        {
          name: "Scout",
          runner: runner3,
        },
        {
          name: "Rebel",
          runner: runner4,
        },
        {
          name: "Lucky",
          runner: runner5,
        },
      ].sort((a, b) => b.runner - a.runner);

      var winner = "";
      var value = 0;
      if (maxR > 99 && value == 0) {
        value = 1;
        if (maxR == runner1) {
          winner = { name: "Chief", id: 1 };
          io.emit("winner", "Chief");
        } else if (maxR == runner2) {
          winner = { name: "Magic", id: 2 };
          io.emit("winner", "Magic");
        } else if (maxR == runner3) {
          winner = { name: "Scout", id: 3 };
          io.emit("winner", "Scout");
        } else if (maxR == runner4) {
          winner = { name: "Rebel", id: 4 };
          io.emit("winner", "Rebel");
        } else if (maxR == runner5) {
          winner = { name: "Lucky", id: 5 };
          io.emit("winner", "Lucky");
        }
        var value = 1;
        if (value == 1) {
          console.log(oranlar[winner.id - 1]);

          Game.find({ selectedSide: winner.name }, (err, data) => {
            History.create(
              {
                winnerHorse: winner.name,
                placements: [
                  {
                    horse: winList[0].name,
                    line: 1,
                  },
                  {
                    horse: winList[1].name,
                    line: 2,
                  },
                  {
                    horse: winList[2].name,
                    line: 3,
                  },
                  {
                    horse: winList[3].name,
                    line: 4,
                  },
                  {
                    horse: winList[4].name,
                    line: 5,
                  },
                ],
              },
              (err, data) => {
                if (err) {
                } else {
                  console.log("History created");
                }
              }
            );
            if (err) {
            } else {
              if (data.length > 0) {
                for (let i = 0; i < data.length + 1; i++) {
                  if (data.length == i) {
                    Game.deleteMany({}, (err, data) => {
                      if (err) {
                      } else {
                      }
                    });
                  } else {
                    if (data[i].userToken == "bot") {
                    } else {
                      User.findOne(
                        { userToken: data[i].userToken },
                        (err, user) => {
                          if (err) {
                          } else {
                            user.deposit =
                              user.deposit +
                              data[i].betAmount * oranlar[winner.id - 1];
                            user.save();
                          }
                        }
                      );
                    }
                  }
                }
              } else {
                Game.deleteMany({}, (err, data) => {
                  if (err) {
                  } else {
                  }
                });
              }
            }
          });
          value = 2;
        }
      }

      io.emit("horse1", runner1);
      io.emit("horse2", runner2);
      io.emit("horse3", runner3);
      io.emit("horse4", runner4);
      io.emit("horse5", runner5);
    }
  }, 100);
}

server.listen(3005, () => {
  console.log("listening on *:3001");
});
