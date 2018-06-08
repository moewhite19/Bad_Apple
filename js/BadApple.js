var badApple = {
	fps: [],
	cont: 0,
	i: 0,
	li: 0,
	f: [],
	colr: "#FFFFFF",
	speed: 32,
	State: 0,
	isPlay: false,
	tick: false,
	out: function() {
		var cont = 0
		var arr = []
		for(var i in badApple.fps) {
			if(cont >= 512) {
				badApple.f.push(arr);
				arr = [];
				cont = 0;
			}
			arr.push(badApple.fps[i])
			cont++
		}
		badApple.f.push(arr);
		arr = [];
	},
	save: function(i) {
		for(i in badApple.f) {
			download(i + ".json", JSON.stringify(badApple.f[i]))
		}
	},
	get: function() {
		badApple.loadtick = byid("loadtick")
		getURL("BadAppleDat/" + "BadApple_" + pad(badApple.li, 4) + ".svg", function(s) {
			if(s == null) {} else {
				var p1 = loadXml(s).children[0].children;
				var ar = []
				for(var i = 0; i < p1.length; i++) {
					var e = p1[i].attributes
					var c = e.fill.nodeValue
					var r = e.d.nodeValue
					if(parseInt(c[1] + c[2], 16) < 86) {
						r = null;
					} else {
						ar.push(r);
						badApple.loadtick.innerText = "获取进度" + badApple.li;
					}
				}
				if(ar.length == 0) {
					badApple.fps.push(["M"]);
				} else {
					badApple.fps.push(ar);
				}
				badApple.li++;
				badApple.get();
			}
		})
	},
	loading: function() {
		badApple.loadout = byid("loadtick");
		getURL("dat/" + badApple.cont + ".json", function(s) {
			if(s === null) {
				badApple.loadout.innerText = "加载完成" + badApple.fps.length
				badApple.State = 2;
			} else {
				var obj = JSON.parse(s);
				for(i in obj) {
					badApple.fps.push(obj[i]);
				}
				if(badApple.isPlay && !badApple.tick) {
					badApple.play();
					badApple.tick = true;
					console.log("块加载完成 继续播放")
				}
				badApple.cont++;
				badApple.loadout.innerText = "已加载" + badApple.fps.length
				badApple.loading();
			}
		})
	},
	load: function() {
		if(badApple.State <= 0) {
			badApple.State = 1;
			player.play(1, 0, true)
			badApple.loading()
		}
	},
	play: function() {
		badApple.test = byid("test");
		badApple.playtick = byid("playtick");
		badApple.viev = byid("outSvg");
		if(badApple.isPlay && badApple.tick) {
			badApple.paus();
		} else if(badApple.State < 1) {
			badApple.tick = false;
			badApple.isPlay = true;
			badApple.load();
			console.log("开始缓存并播放")
		} else {
			badApple.tick = true;
			badApple.isPlay = true;
			player.play();
			badApple.playing();
			console.log("继续播放")
		}
	},
	paus: function() {
		badApple.tick = false;
		badApple.isPlay = false;
		player.pause();
		console.log("暂停");
	},
	stop: function() {
		badApple.tick = false;
		badApple.isPlay = false;
		badApple.i = 0;
		player.play(1, 0, true);
	},
	playing: function() {
		if(badApple.tick) {
			var arr = [];
			var gen = badApple.fps[badApple.i];
			if(gen == undefined) {
				if(badApple.State == 2) {
					console.log("播放完成");
					badApple.stop();
				} else {
					badApple.tick = false;
					player.pause();
					console.log("缓存中")
				}
			} else {
				badApple.playtick.innerText = "播放进度:" + badApple.i
				badApple.i++;
				for(ii in gen) {
					arr.push('<path fill=' + badApple.colr + ' opacity=\"1.00\" d=\"' + gen[ii] + '\"></path>');
				}
				badApple.viev.innerHTML = arr.join("\n");
				arr = [];
				badApple.t = parseInt(player.audio.prop('currentTime') / 0.033);
				//声音和画面同步
				var t
				if(badApple.i < badApple.t) { //如果画面慢于音乐
					t = badApple.t - badApple.i
					if(t > 10) {
						badApple.i = badApple.t;
						setTimeout(badApple.playing, 32)
					} else {
						setTimeout(badApple.playing, 30 - t)
					}
				} else if(badApple.i > badApple.t) { //如果音乐慢于画面
					t = badApple.i - badApple.t
					if(t > 10) {
						badApple.i = badApple.t;
						setTimeout(badApple.playing, 32)
					} else {
						setTimeout(badApple.playing, 34 + t)
					}
				} else {
					t = 0
					setTimeout(badApple.playing, 32)
				}
				badApple.test.innerText = "   声画延迟" + t
			}
		}
	}

};
//绑定按键事件
document.onkeydown = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e.keyCode == 32) {
		badApple.play();
	}
}