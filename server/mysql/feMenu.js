var mysql = require("mysql"); // 调用MySQL模块

// 创建一个connection
var connection = mysql.createConnection({
  host: "rm-2ze2ifqvx4ez2dg9g0o.mysql.rds.aliyuncs.com", // 主机
  user: "a876691666", // MySQL认证用户名
  password: "ASDasd!@#123", // MySQL认证用户密码
  port: "3306", // 端口号
  database: "fe-menu"
});

module.exports = connection;
