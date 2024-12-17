/* ==================
	        工具方法
	==================== */
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	dateToStr : function(date) {
		var year = date.getFullYear(); // 年
		var month = date.getMonth() + 1; // 月
		var day = date.getDate(); // 日
		// 添加前导零
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return year + '-' + month + '-' + day;
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};


function ellipsisFileName(str, maxLength) {
	const strLength = str.length
	let data = []
	if (strLength > maxLength) {
		data.push(str.substr(0, strLength - maxLength))
		data.push(str.substr(-maxLength))
	} else {
		data.push(str)
	}
	return data
}; 

/* ==================
	        登录相关
	 ==================== */
function isLogin(){
	var phoneNumber = wx.getStorageSync('phoneNumber');
	var openId = wx.getStorageSync('openId');
	var userInfo = wx.getStorageSync('userInfo');
	var sessionKey = wx.getStorageSync('sessionKey');
	var cookie = wx.getStorageSync('cookie');
	// 获取缓存的登录信息
	if (/* phoneNumber && */openId && userInfo) {
		console.log("用户已登陆", userInfo);
		getApp().globalData.UserLogin = true;
		getApp().globalData.openId = openId;
		getApp().globalData.phoneNumber = phoneNumber;
		getApp().globalData.userInfo = userInfo
		getApp().globalData.sessionKey = sessionKey
		getApp().globalData.cookie = cookie
	}else{
		console.log("用户未登陆");
		getApp().globalData.UserLogin = false
	}
	return getApp().globalData.UserLogin;
};

function  logout() {
	uni.showLoading({
		title: '正在登出'
	});
	getApp().globalData.openId = '';
	getApp().globalData.userInfo = [];
	getApp().globalData.sessionKey = '';
	getApp().globalData.cookie = '';
	try {
		// uni.clearStorageSync();
		uni.removeStorageSync("openId");
		uni.removeStorageSync("userInfo");
		uni.removeStorageSync("sessionKey");
		uni.removeStorageSync("cookie");
	} catch (e) {
		// error
	}
	uni.hideLoading();
	if(!this.isLogin()){
		uni.redirectTo({
			url: '../login/login',
		});
	}
};


export default{
	formatTime,
	formatLocation,
	dateUtils,
	isLogin,
	ellipsisFileName,
	logout
}
