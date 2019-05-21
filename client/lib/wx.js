function fenxiang(title, link, imgUrl, desc){
	var appId = 'wxf52b094d48b2c719',
		timestamp = new Date().getTime(),
		noncestr = timestamp.toString(16),
		option = {
		    title: title, // 分享标题
		    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: imgUrl, // 分享图标
		    desc:desc,
		    success: function () {
		    // 用户确认分享后执行的回调函数
		    	alert('分享成功')
		    }
		};

	function config(timestamp, noncestr){
		$.ajax({
			url:'/wx/signature',
			type:'post',
			data:{
				timestamp:timestamp,
				noncestr:noncestr
			},
			success:function (signature) {
				wx.config({
				    // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: appId, // 必填，公众号的唯一标识
				    timestamp: timestamp, // 必填，生成签名的时间戳
				    nonceStr: noncestr, // 必填，生成签名的随机串
				    signature: signature,// 必填，签名
				    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表
				});
			}
		})
	}

	config(timestamp, noncestr)


	wx.ready(function(){
		console.log('验证成功')

		wx.onMenuShareTimeline(option)
		wx.onMenuShareAppMessage(option)
		wx.onMenuShareQQ(option)
		wx.onMenuShareWeibo(option)
		wx.onMenuShareQZone(option)

	    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	});

	wx.error(function(res){
	    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		console.log('验证失败')
	});
}