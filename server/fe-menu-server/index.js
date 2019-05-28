var express = require("express");
var router = express.Router();
const { feMenu } = require("../mysql");

router.get("/javascriptApi/getGlobalList", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  feMenu.get("javascriptApiGlobalList", "apiName, description").then(dbRes => {
    res.send(dbRes.data);
  });
})

module.exports = router;
