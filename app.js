const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const Mysql = require("./server/mysql");

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var ejs = require("ejs");
app.set("views", path.join(__dirname, "/"));
app.engine("html", ejs.__express);
app.set("view engine", "html");

app.use("/", express.static("client"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/wx", require("./server/wx"));
app.use("/fe-menu", require("./server/fe-menu-server"));

app.get("/", function(req, res) {
  res.render("./index.html");
});
app.get("*", function(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  res.render(pathname + "/index.html");
});

var server = app.listen(80, function() {
  console.log("启动成功");
});
