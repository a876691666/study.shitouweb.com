	function getFileExt(str){
		var d=/\.[^\.]+$/.exec(str)[0]; 
		if(d.indexOf('#') != -1) d = d.split('#')[0];
		if(d.indexOf('?') != -1) d = d.split('?')[0];
		if(d.indexOf(':') != -1) d = d.split(':')[0];
		if(d.indexOf('.') != -1) d = d.split('.')[1];
		
		return d
	}

	var _id = undefined, 
		_type = undefined,
		setSpeet = 0.2, 
		click = 'click';

	var videoType = {
		avi:'video/avi',
		wmv:'',
		mpeg:'video/mpeg',
		mp4:'video/mp4',
		mov:'',
		mkv:'MKV-application/octet-stream',
		flv:'video/x-flv',
		f4v:'application/octet-stream',
		m3u8:'application/x-mpegURL',

		// m4v:'',
		// rmvb:'',
		// rm:'',
		// 3gp:'',
		// dat:'',
		// ts:'',
		// mts:'',
		// vob:'',
	}

	function myBrowser(){
		if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)){
			return true
		}
		return false;
	}
	//以下是调用上面的函数
	var mb = myBrowser();


	var url = 'http://yntvapp.4kb.cn/webapp-yrt',
		userId = '989706884811304960';

	var options = {
		html5: {
				hls: {
						withCredentials: true
					}
		},
		flash: {
				hls: {
						withCredentials: true
				}
		}
	};

	var wsListStore = null

	function callHandler(){
		if(window.WebViewJavascriptBridge && window.WebViewJavascriptBridge.callHandler) window.WebViewJavascriptBridge.callHandler.apply(window.WebViewJavascriptBridge, arguments);
	}

	function registerHandler(){
		var ar = arguments;
		connectWebViewJavascriptBridge(function(bridge){
			bridge.registerHandler.apply(bridge, ar);
		})
	}

	function refreshPage() {
		jQuery.mobile.pageContainer.pagecontainer('change', window.location.href, {
			allowSamePageTransition: true,
			transition: 'none',
			reloadPage: true 
			// 'reload' parameter not working yet: //github.com/jquery/jquery-mobile/issues/7406
		});
	}

	function get (u, callback, data){
		if(!data) data = {};
		data.userId = userId;
		$.ajax({
			type:'get',
			url:url+u,
			dataType:'jsonp',
			jsonpCallback:'onBack',
			data:data,
			async:false,
			success:function(data){
				if(data.loginStatus == false) callHandler('login');
				if(data.errorMessage == '非法请求') showDialog(data.errorMessage);
				callback(data)
			}
		})
	}

	function getWSList(callback, data){
		get('/play/TVList.do', callback, data);
	}

	function getPDList(callback, data){
		get('/play/channelList.do', callback, data);
	}

	function getPDDetail(callback, data){
		get('/play/channelLive.do', callback, data);
	}

	function getJMList(callback, data){
		get('/play/programList.do', callback, data);
	}


	function createBtn(text, className){
		return '<button class="ui-btn '+ className +'">' + text + '</button>'
	}


	function createTR(tdList){
		var dom =  $('<tr></tr>');
		for(var i in tdList) dom.append(tdList[i]);
		return dom;
	}

	function createTD(DOM, className){
		var dom = $('<td class="'+ (className || '') +'"></td>')
		return dom.append(DOM);
	}

	function createTable(trList, id){
		var dom = $('<div class="tablist-content"></div> ');
		var table = $('<table data-role="table" id="'+ (id || '') +'" data-mode="columntoggle" class="ui-responsive table-stroke"></table>');
		var tb = $('<tbody></tbody>');
		for(var i in trList) tb.append(trList[i]);
		return dom.append(table.append(tb))
		}

	function removeShadow(){
		setTimeout(function(){
			$('#my-player').removeClass('video-qxdBoxShow');
			$('#my-player').removeClass('video-settingBoxShow');
			$('#my-player').removeClass('video-selectPDBoxShow');
			$('#my-player').removeClass('video-fenxiangBoxShow');
		}, 100)
	} 
	function creatTouchstartEventAndDispatch (el) { 
		var event = document.createEvent('TouchEvent');
		var event2 = document.createEvent('TouchEvent');

		event.initUIEvent('touchstart', true, true); 
		event2.initUIEvent('touchend', true, true); 

		Object.defineProperty(event, "touches", {
		    value: [{
				pageX:1
		    }],
		    writable: true
		});
		event2.touches = [{

	    }];	
		el.dispatchEvent(event); 
		el.dispatchEvent(event2); 
	} 

	var flag = true;
	getWSList(function (data) {
		if(flag){
			flag = false;
			wsListStore = data.list
			setVideoSelectPDBox(wsListStore);
		}
	})


	var player = videojs('my-player', options, function onPlayerReady() {
		videojs.log('Your player is ready!');

		// In this context, `this` is the player that was created by Video.js.

		this.play();
		$('.vjs-big-play-button').click();
	});
	setTimeout(function(){

		// creatTouchstartEventAndDispatch($('#my-player .vjs-big-play-button')[0])
	}, 1000)
	player.isFullscreen_ = true;
	
	function play(url, id, type){
		_id = id;
		_type = type;
		

		var type = videoType[getFileExt(url)];
		if(url.indexOf('rtmp://') != -1) type = 'rtmp/flv';
		if(url.indexOf('m3u8') != -1) type = 'application/x-mpegURL';
		player.src({
			src:url,
			type:type,
			withCredentials:true
		})
		player.play();
	}

	function resize (){

		var width = $(window).height(),
			height = $(window).width();
		$("#my-player").css({
			width:width+'px',
			height:height+'px',
			"transform-origin":(height/2)+'px'
		})
	}

/* 原工具栏按钮 */
	var qxd = $('<button class="vjs-control vjs-button ui-btn-hidden" type="button" aria-live="polite" title="清晰度" aria-disabled="false" data-disabled="false"><span aria-hidden="true" class="vjs-icon-placeholder">标清</button>')

	qxd.on(click, function(){
		$('#my-player').addClass('video-qxdBoxShow');
	})

	var full = $('<button class="vjs-fullscreen-control vjs-control vjs-button ui-btn-hidden" type="button" aria-live="polite" title="Fullscreen" aria-disabled="false" data-disabled="false"><span aria-hidden="true" class="vjs-icon-placeholder"></span><span class="vjs-control-text">Fullscreen</span></button>');

	full.on(click, toggleFull)
	function toggleFull () {
		setTimeout(function(){
			$("body").toggleClass('full')
			if($("body").hasClass('full')){
				$(window).on('resize', resize);
				resize();
			}else{
				$(window).off('resize', resize);
				$("#my-player").attr('style', '');
			}
		}, 100)
	}

	var setting = $('<button class="vjs-control vjs-button ui-btn-hidden" type="button" aria-live="polite" title="设置" aria-disabled="false" data-disabled="false"><span aria-hidden="true" class="vjs-icon-placeholder">设置</button>');

	setting.on(click, function(){
		$("#my-player").addClass('video-settingBoxShow');
	})


	$("#my-player").find('.vjs-control-bar').find('.vjs-fullscreen-control').hide();
	$("#my-player").find('.vjs-control-bar').append(qxd);
	$("#my-player").find('.vjs-control-bar').append(setting);
	$("#my-player").find('.vjs-control-bar').append(full);



/* 新工具栏按钮 */
	var shoucang = $("<span class='shocang'>收藏</span>");
	shoucang.on(click, function (argument) {
		get('/play/collection.do', function(data){
			showDialog(data.message);
		}, {id:_id, type:_type})
	})
	function setShoucang(text){
		shoucang.text(text);
	}

	var fenxiang = $("<span class='fenxiang'>分享</span>");
	fenxiang.on(click, function (argument) {
		$('#my-player').addClass('video-fenxiangBoxShow');
	})

	var pindao = $("<span class='pindao'>频道</span>");
	pindao.on(click, function (argument) {
		setTimeout(function(){
			$('#my-player').addClass('video-selectPDBoxShow');
		}, 100)
	})

	var pageBack = $("<span class='pageBack'><image src='images/u302.png'></image></span>");
	pageBack.on(click, toggleFull)


	var tools = $("<div class='video-tools'></div>");
	tools.append(pindao);
	tools.append(shoucang);
	// tools.append(fenxiang);
	tools.append(pageBack);



/* 新层 */
	var dialog = $("<div class='video-dialog'>弹出层</div>");
	dialog.hide();

/*清晰度*/
	var qxdBox = $("<div class='video-qxdBox'></div>");

	var bq = $(createBtn('标清'));
	
	qxdBox.append(bq);


	function clearTC(){
		$("#my-player").removeClass('h_50');
		$("#my-player").removeClass('h_75');
		$("#my-player").removeClass('h_100');
		$("#my-player").removeClass('h_tc');
	}

/*设置*/
	var settingBox = $("<div class='video-settingBox'></div>")

	var hm = $("<div class='video-hm'>画面：</div>")
	var h_50 = $("<div class='hm_btn'><image src='images/u394.png'></image>50%</div>");
	var h_75 = $("<div class='hm_btn'><image src='images/u394.png'></image>75%</div>");
	var h_100 = $("<div class='hm_btn'><image src='images/u394.png'></image>100%</div>");
	var h_tc = $("<div class='hm_btn'><image src='images/u394.png'></image>填充</div>");

	h_50.on(click, function(){
		clearTC();
		$("#my-player").addClass('h_50');
	})
	h_75.on(click, function(){
		clearTC();
		$("#my-player").addClass('h_75');
	})
	h_100.on(click, function(){
		clearTC();
		$("#my-player").addClass('h_100');
	})
	h_tc.on(click, function(){
		clearTC();
		$("#my-player").addClass('h_tc');
	})

	hm.append($('<div></div>'))
	hm.append(h_50);
	hm.append(h_75);
	hm.append(h_100);
	hm.append(h_tc);

	var ldBox = $('<input class="video-settingBox-ld" id="video-settingBox-ld" start="aaa" data-mini="true" type="range" min="0" max="100" value="100">');
	var ylBox = $('<input class="video-settingBox-ld" id="video-settingBox-yl" start="aaa" data-mini="true" type="range" min="0" max="100" value="100">');
	settingBox.append(hm)
	settingBox.append('亮度：')
	settingBox.append(ldBox)
	ldBox.on('change input', function(){
		setBrightness($(this).val());
	})
	
	settingBox.append('<div></div>音量：')
	settingBox.append(ylBox)
	ylBox.on('change input', function(){
		setVolume($(this).val());
	})


	function setBrightness(num){
		callHandler('setBrightness', num);
		setLD(num)
		console.log(ld);
	}
	function setVolume(num){
		callHandler('setVolume', num);
		setYL(num)
		console.log(yl);
	}
	var mrld, mryl
	registerHandler('getBrightness', function (data, responseCallback) {
		setLD(mrld = data.num)
	});
	registerHandler('getVolume', function (data, responseCallback) {
		setYL(mryl = data.num)
	});

	function setLD (n){
		$('#video-settingBox-ld').val(n)
		ld = Math.min(n, 100);
		ld = Math.max(ld, 0);
	}
	function setYL (n){
		$('#video-settingBox-yl').val(n)
		yl = Math.min(n, 100);
		yl = Math.max(yl, 0);
	}

	var hfmr = $(createBtn('恢复默认', 'video-hfmr'));
	hfmr.on(click, function(){
		clearTC();
		$("#my-player").addClass('h_tc');
		setBrightness(mrld || 100)
		setVolume(mryl || 100)
	})
	settingBox.append(hfmr);


/*卫视选择*/
	var selectPDBox = $("<div class='video-selectPDBox'></div>")
	var typeList = $('<div class="typeList" data-role="controlgroup" data-mini="true"></div>');
	var wsList = $('<div class="wsList" data-role="controlgroup" data-mini="true"></div>');

	function setVideoSelectPDBox(list){
		list.forEach(function(d){
			(function(d){
				var _d = d;
				var ws = $(createBtn(d.name, 'ui-corner-all'));
				ws.on(click, function(){
					wsList.children().remove();
					getPDList(function(data){
						data.list.forEach(function(d){
							var w = $(createBtn(d.name, 'ui-corner-all'));
							w.on(click, function(event){
								setTimeout(function(){
									removeShadow();
								}, 100)
								getPDDetail(function(data){
									if(data.data.url) play(data.data.url, d.id, '90')
										setShoucang(data.data.isCollection == '1' ? '取消收藏' : '收藏')
								}, {id: d.id})
							})
							wsList.append(w);
						})
						wsList.trigger("create");
					}, {id:d.id, type:d.type})
				})
				typeList.append(ws);

			})(d)
			
		})
		typeList.trigger("create");
	}
	selectPDBox.append(typeList);
	selectPDBox.append(wsList);

/*分享*/
	var fenxiangBox = $("<div class='video-fenxiangBox'></div>");
	var fBox = $("<div class='video-fBox'></div>")

	var fx_qq = $("<div class='fx_btn'><image src='images/u349.png'></image>QQ</div>")
	fx_qq.on(click, function(){
		callHandler('share', {type: '1'}, function (response) {
				console.log('qq', response)
		});
	})
	var fx_kj = $("<div class='fx_btn'><image src='images/u351.png'></image>QQ空间</div>")
	fx_kj.on(click, function(){
		callHandler('share', {type: '2'}, function (response) {
				console.log('kj', response)
		});
	})
	var fx_wx = $("<div class='fx_btn'><image src='images/u353.png'></image>微信</div>")
	fx_wx.on(click, function(){
		callHandler('share', {type: '0'}, function  (response) {
				console.log('wx', response)
		});
	})
	// var fx_py = $("<div class='fx_btn'><image src='images/u355.png'></image>朋友圈</div>")
	// fx_py.on(click, function(){
	//   callHandler('share', {type: '1'}, function (response) {
	//       console.log('py', response)
	//   });
	// })
	var fx_wb = $("<div class='fx_btn'><image src='images/u357.png'></image>微博</div>")
	fx_wb.on(click, function(){
		callHandler('share', {type: '3'}, function (response) {
				console.log('wb', response)
		});
	})
	var fx_fz = $("<div class='fx_btn'><image src='images/u347.png'></image>复制链接</div>")
	fx_fz.on(click, function(){
		callHandler('share', {type: '4'}, function (response) {
				console.log('fz', response)
		});
	})

	fBox.append(fx_qq)
	fBox.append(fx_kj)
	fBox.append(fx_wx)
	// fBox.append(fx_py)
	fBox.append(fx_wb)
	fBox.append(fx_fz)

	fenxiangBox.append(fBox)


/*锁定*/
	var lock = $("<div class='video-lockBox'></div>")
	lock.on(click, function(){
		$('#my-player').toggleClass('video-lock');
	})
	var lockShadow = $("<div class='video-lockShadow'></div>");

	var boxShadow = $("<div class='video-boxShadow'></div>");
	boxShadow.on(click, removeShadow)

	var dialogTime = 0;
	function showDialog (context){
		if(!context) return;
		dialog.text(context);
		dialog.show(100);
		clearTimeout(dialogTime);
		dialogTime = setTimeout(function(){
			dialog.hide(300);
		}, 3000)
	}

	/*亮度滑动*/
	var brightness = $("<div class='video-brightness' ondragstart='return false;'></div>");
	var ld_oldx = 0;
	var brightnessFlag = false;
	var ld = 0;
	var xy = null;
	brightness.on('touchstart mousedown', function(event){
		ld_oldx = (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX);
		xy = (event.originalEvent.pageY || event.originalEvent.changedTouches["0"].pageY) + '' + (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX)
		brightnessFlag = true;
	})
	brightness.on('touchmove mousemove', function(event){
		if(!brightnessFlag) return;
		ld += ((event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX) - ld_oldx) * setSpeet
		ld_oldx = (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX);
		setBrightness(ld);
	})
	brightness.on('touchend mouseup', function(event){
		ld_oldx = 0;
		ld = Math.min(ld, 100);
		brightnessFlag = false;
		if((event.originalEvent.pageY || event.originalEvent.changedTouches["0"].pageY) + '' + (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX) === xy) {
		    if (player.paused()) {
		      player.play();
		    } else {
		      player.pause();
		    }
		}
	})

	/*音量滑动*/
	var volume = $("<div class='video-volume' ondragstart='return false;'></div>");
	var yl_oldx = 0;
	var volumeFlag = false;
	var yl = 0;
	var xy2 = null;
	volume.on('touchstart mousedown', function(event){
		yl_oldx = (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX);
		xy2 = (event.originalEvent.pageY || event.originalEvent.changedTouches["0"].pageY) + '' + (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX)
		volumeFlag = true;
	})
	volume.on('touchmove mousemove', function(event){
		if(!volumeFlag) return;
		yl += ((event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX) - yl_oldx) * setSpeet
		yl_oldx = (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX);
		setVolume(yl)
	})
	volume.on('touchend mouseup', function(event){
		yl_oldx = 0;
		volumeFlag = false;
		if((event.originalEvent.pageY || event.originalEvent.changedTouches["0"].pageY) + '' + (event.originalEvent.pageX || event.originalEvent.changedTouches["0"].pageX) === xy2) {
		    if (player.paused()) {
		      player.play();
		    } else {
		      player.pause();
		    }
		}
	})

/* 增加层 */
	$('#my-player').append(dialog)
	$('#my-player').append(lock)
	$('#my-player').append(tools)
	$('#my-player').append(qxdBox)
	$('#my-player').append(boxShadow)
	$('#my-player').append(settingBox)
	$('#my-player').append(lockShadow)
	$('#my-player').append(selectPDBox)
	$('#my-player').append(fenxiangBox)
	$('#my-player').append(brightness)
	$('#my-player').append(volume)





	var m3u8 = [
			'http://store1.yntv.cn/channels/yn/yntv-intl/m3u8:sd',
			'http://116.55.228.232:1935/radio/xwgb.stream/playlist.m3u8',
			'http://store2.yntv.cn/channels/yn/YNTV_1/m3u8:sd/1525199340000,1525202160000', 
			'http://store2.yntv.cn/channels/yn/YNTV_1/m3u8:sd',
			'http://hls3a.douyucdn.cn/live/703747rcfoQ8tRJg_550/playlist.m3u8?wsSecret=618bf0e176d823cb3138a02e728e3fa3&wsTime=1525092787&token=h5-douyu-0-703747-69e0a8199ae773815d6da72f408ea58a&did=AND-CHR|46-975195871525095469519', 
			'http://pullhls8928c963.live.126.net/live/618f4060864140b5b15f951ffc3eb470/playlist.m3u8',
			'http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8'
		];

	var rtmp = [
			'rtmp://v8928c963.live.126.net/live/618f4060864140b5b15f951ffc3eb470',
			'rtmp://live.hkstv.hk.lxdns.com/live/hks'
		];

// registerHandler('');

if (myBrowser()) {
	play(m3u8[1]);
}else{

	// player.src({
	// 	src:rtmp[1],
	// 	type:'rtmp/flv',
	// 	withCredentials: true
	// })
	// play(rtmp[1]);
	play('//vjs.zencdn.net/v/oceans.mp4', undefined, '90')
}
