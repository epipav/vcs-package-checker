const express = require("express");
const bodyParser = require("body-parser");

const scheduleRoutes = require("./routes/schedule");
const app = express();
var path = require('path');

app.use(bodyParser.json());
//app.set('views', path.join(__dirname, 'views'));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//serve the content straight from the distribution folder (output after npm run build)
app.use(express.static("dist"));

//serve out the api
app.use("/api/schedule", scheduleRoutes);

app.listen(3000);
