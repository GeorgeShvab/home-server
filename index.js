const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const PORT = process.env.PORT;

const API_KEY = process.env.WEATHER_API_KEY;

const LATITUDE = process.env.DEFAULT_LATITUDE;
const LONGITUDE = process.env.DEFAULT_LONGITUDE;

const app = express();

let subscriptions = [];

app.use(bodyParser.json());
app.use("/", express.static("static"));

app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.status(201).json();
});

webPush.setVapidDetails(`https://${SERVER_ADDRESS}`, PUBLIC_KEY, PRIVATE_KEY);

app.listen(PORT, () => console.log("🚀 Server is running on port:", PORT));

const sendPushMessages = async () => {
  if (!subscriptions.length) return;

  const data = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&exclude=minutely,alerts&appid=${API_KEY}&units=metric&lang=uk`
  );

  let body = await data.json();

  const dataToSend = {
    temp: Math.round(body.current.temp),
    humidity: Math.round(body.current.humidity),
    desc: body.current.weather[0].description,
  };

  const promises = subscriptions.map((subscription) =>
    webPush.sendNotification(subscription, JSON.stringify(dataToSend))
  );

  await Promise.all(promises);
};

cron.schedule("* * * *", () => sendPushMessages());
