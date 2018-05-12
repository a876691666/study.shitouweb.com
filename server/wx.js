const https = require('https'),
	_url = require('url'),
	crypto = require('crypto'); //引入加密模块

var express = require('express');
var router = express.Router();

var appid = 'wxf52b094d48b2c719',
	secret = '21c4920744dc76e9eb98913f71fa4297',
	access_token = null,
	access_token_flag = false,
	jsapi_ticket = null,
	jsapi_ticket_flag = false;

var href = {
	token: 'https://api.weixin.qq.com/cgi-bin/token',
	ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
}

function attrFormat(obj){
	var attr = [];

	for(var i in obj){
		attr.push(i + '=' + obj[i]);
	}

	return attr.join('&');;
}

function getAttrFormat(url, obj){

	return url + '?' + attrFormat(obj);
}

function get(url, data, callback){
	var content = '';
	https.get(getAttrFormat(url, data), function(res){
		res.setEncoding('utf8');
		res.on('data', (d) => {
			content += d
		});
		res.on('end', function(){
			callback(JSON.parse(content));
		});
	})
}

function getAccessToken(callback){
	if(!access_token_flag){
		get(href.token, {
			appid:appid,
			secret:secret,
			grant_type:'client_credential'
		}, function(data){
			access_token = data
			access_token_flag = true;
			setTimeout(function(){
				access_token_flag = false;
			}, 7000000)
			callback(access_token.access_token);
		})
	}else{
		callback(access_token.access_token);
	}
}

function getJsapiTicket(callback){
	if(!jsapi_ticket_flag){
		getAccessToken(function(access_token){
			get(href.ticket, {
				access_token:access_token,
				type:'jsapi'
			}, function(data){
				jsapi_ticket = data
				jsapi_ticket_flag = true;
				setTimeout(function(){
					jsapi_ticket_flag = false;
				}, 7000000)
				callback(jsapi_ticket.ticket);
			})
		})
	}else{
		callback(jsapi_ticket.ticket);
	}
}

router.post('/getAccessToken', function(req, res, next) {
	getAccessToken(function(access_token){
		res.send(access_token);
	})
}).post('/getTicket', function(req, res, next) {
	getJsapiTicket(function(ticket){
		res.send(ticket);
	})
}).post('/signature', function(req, res, next) {
    var {timestamp, noncestr} = req.body;
    var url = req.headers.referer;

    getJsapiTicket(function(jsapi_ticket){
    	var tempStr = attrFormat({jsapi_ticket, noncestr, timestamp, url });
	    const hashCode = crypto.createHash('sha1'); //创建加密类型 
	    var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
	    res.send(resultCode);
    })

})

module.exports = router;
