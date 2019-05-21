var express = require("express");
var router = express.Router();
const { feMenu } = require("../mysql");

const registerHttp = (httpType, url, callback) => {
  router[httpType](url, callback);
};

registerHttp("get", "/javascriptApi/getGlobalList", function(req, res, next) {
  feMenu.get("javascriptApiGlobalList", "apiName, description").then(dbRes => {
    res.send(dbRes.data);
  });
});

module.exports = router;
