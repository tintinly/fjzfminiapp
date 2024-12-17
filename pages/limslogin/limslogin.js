const utils = require('../../common/util.js');
const rsajs = require('../../common/utils/RSA.js');
const md5js = require('../../common/MD5.js');
export default {
	methods: {
		limsLogin(username, password) {
			wx.login({
				success:(wxLoginRes)=>{
					uni.showLoading({
						title: '登陆中'
					});
					var loginCode = wxLoginRes.code;
					//发起网络请求
					uni.showLoading({
						title: '登陆中'
					});
					wx.request({
						url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-openId',
						method : 'POST',
						data: {
							appId : getApp().globalData.appId,
							loginCode: loginCode,
						},
						success:(openIdData)=>{
							console.log('微信身份信息',openIdData)
							if (openIdData.statusCode === 500 || openIdData.statusCode === 404) {
								uni.showToast({
									duration:1500,
									title: '网络错误',
									icon : 'error'
								})
							}
							wx.request({
								url: getApp().globalData.host + '/open/security/public-key',
								method : 'get',
								success:(publicKeyRes)=>{
									var publicKey = publicKeyRes.data;
									var encodePwd = rsajs.encryptData(publicKey, password);
									wx.request({
										url: getApp().globalData.host + '/core/module/sys/login',
										method : 'post',
										data: {
											// loginType : 'wxmpsso',
											openId : openIdData.data.openid,
											id : username,
											password : encodePwd
										},
										header:{
											"SECURITY-RSA-KEY": publicKey,
											"content-type": 'application/x-www-form-urlencoded'
										},
										success: (limsLoginData) =>{
											console.log("lims登录", limsLoginData);
											if (limsLoginData.statusCode = '401' && limsLoginData.data.error == 'Unauthorized') {
												// GIKAM.SECURITY.LOGIN.INCORRECT_USER_OR_PASSWORD
												// GIKAM.SECURITY.LICENSE.LOGIN_USER_EXCEEDED
												uni.showToast({
													duration: 2000,
													title: '登录失败',
												});
												uni.hideLoading();
												return;
											}
											wx.setStorageSync('cookie', limsLoginData.header['Set-Cookie']);
											wx.setStorageSync('username', username); // 用户名缓存
											var cookie = limsLoginData.header['Set-Cookie'];
											console.log(cookie);
											if (cookie) {
												var arr = cookie.split('=');
												var key = arr.shift();
												var value = arr.join();
												var header = {};
												header[key] = value;
												header['sunway-remember-me'] = value;
												header['user'] = md5js.default.hex_md5(username);
												console.log(header);
											}
											wx.request({
												url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-user-info',
												data: {
													openId : openIdData.data.openid,
													userId : username,
													// phoneNumber: phoneNumber
												},
												header : header,
												method : 'POST',
												success: (userInfoData) =>{
													console.log("用户信息",userInfoData)
													if (userInfoData.statusCode === 500 || userInfoData.statusCode === 404) {
														uni.showToast({
															duration:1500,
															title: '网络错误',
															icon : 'error'
														})
													}
													var openId = openIdData.data.openid;
													var sessionKey = openIdData.data.session_key;
													// wx.setStorageSync('phoneNumber', phoneNumber);
													wx.setStorageSync('openId', openId);
													wx.setStorageSync('sessionKey', sessionKey);
													var userInfo = userInfoData.data;
													if(userInfo.openId != undefined){
														wx.setStorageSync('userInfo', userInfo);
														console.log("用户信息",userInfo);
														// that.selectRedDotCue();
														utils.default.isLogin();
														uni.switchTab({
															url: '../home/home',
														})
													}else {
														utils.default.isLogin();
														uni.navigateTo({
															url: '../logon/logon',
														})
													}
													uni.hideLoading();
												},
												fail: userInfoData=>{
													console.log('获取用户信息失败',userInfoData);
													wx.navigateTo({
														url: '../login/login',
													});
													uni.hideLoading();
												},
											})
										},
										fail: limsLoginData=>{
											console.log('lims登录失败',limsLoginData);
											uni.hideLoading();
										}
									})
								},
								fail: (publicKeyRes)=>{
									console.log('获取publicKey失败',publicKeyRes);
									wx.navigateTo({
										url: '../login/login',
									});
									uni.hideLoading();
								}
							})
						},
						fail: openIdData=>{
							console.log('获取openId失败',openIdData);
							wx.navigateTo({
								url: '../login/login',
							});
							uni.hideLoading();
						},
					})
				}
			});
		}
	},
	
	
}