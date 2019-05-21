var express = require("express");
var router = express.Router();
const { feMenu } = require("../mysql");

const registerHttp = (httpType, url, callback) => {
  router[httpType](url, callback);
};

registerHttp("get", "/javascriptApi/getGlobalList", function(req, res, next) {
  feMenu.get("globalList", "apiName, description").then(dbRes => {
    res.send(dbRes);
  });
  return;
  res.send([
    {
      apiName: "String",
      description: "String 全局对象是一个用于字符串或一个字符序列的构造函数。"
    },
    {
      apiName: "Number",
      description:
        "JavaScript 的 Number 对象是经过封装的能让你处理数字值的对象。Number 对象由 Number() 构造器创建。"
    },
    {
      apiName: "Boolean",
      description: "Boolean对象是一个布尔值的对象包装器。"
    },
    {
      apiName: "Date",
      description: "Date 对象用于处理日期和时间。"
    },
    {
      apiName: "JSON",
      description:
        "JSON对象包含两个方法: 用于解析 JavaScript Object Notation  (JSON) 的 parse() 方法，以及将对象/值转换为 JSON字符串的 stringify() 方法。除了这两个方法, JSON这个对象本身并没有其他作用，也不能被调用或者作为构造函数调用。"
    },
    {
      apiName: "Match",
      description:
        "Math 是一个内置对象， 它具有数学常数和函数的属性和方法。不是一个函数对象。"
    },
    {
      apiName: "Object",
      description: "Object 构造函数创建一个对象包装器。"
    },
    {
      apiName: "Array",
      description:
        "JavaScript的 Array 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。"
    },
    {
      apiName: "Function",
      description:
        "Function 构造函数 创建一个新的Function对象。 在 JavaScript 中, 每个函数实际上都是一个Function对象。"
    },
    {
      apiName: "Error",
      description:
        "通过Error的构造器可以创建一个错误对象。当运行时错误产生时，Error的实例对象会被抛出。"
    },
    {
      apiName: "RegExp",
      description:
        "RegExp 构造函数创建了一个正则表达式对象，用于将文本与一个模式匹配。"
    },
    {
      apiName: "Map",
      description:
        "Map 对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。"
    },
    {
      apiName: "Set",
      description:
        "Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。"
    },
    {
      apiName: "WeakMap",
      description:
        "WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。"
    },
    {
      apiName: "WeakSet",
      description: "WeakSet 对象允许你将弱保持对象存储在一个集合中。"
    }
  ]);
});

module.exports = router;
