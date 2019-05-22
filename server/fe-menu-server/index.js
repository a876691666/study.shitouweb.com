var express = require("express");
var router = express.Router();
const { feMenu } = require("../mysql");

router.get("/javascriptApi/getGlobalList", function(req, res, next) {
  feMenu.get("javascriptApiGlobalList", "apiName, description").then(dbRes => {
    res.send(dbRes.data);
  });
})

module.exports = router;
