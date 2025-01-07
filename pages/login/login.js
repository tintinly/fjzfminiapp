import { HTTP } from '../../common/http.js'
const utils = require('../../common/util.js');
export default {
	methods: {
		
		getPhoneNumber(e) {
			var that = this;
			console.log(e);
			// 企业的小程序号未认证则无法获取用户手机号 因此暂时忽略
			// if (errMsg.indexOf("fail") > -1) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '用户拒绝微信手机协议，请重新授权',
			// 		duration: 1500
			// 	});
			// 	return
			// }
			var phoneCode = e.detail.code
			wx.login({
				success: (res)=>{
					var loginCode = res.code
					console.log('微信登录授权码',loginCode);
					if (loginCode) {
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
									url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-phone',
									method : 'POST',
									data: {
										appId : getApp().globalData.appId,
										phoneCode: phoneCode
									},
									success : (phoneData)=>{
										var phoneNumber = phoneData.data.phone_info ? phoneData.data.phone_info.phoneNumber : undefined
										wx.request({
											url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-user-info',
											data: {
												openId : openIdData.data.openid,
												phoneNumber: phoneNumber
											},
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
												wx.setStorageSync('phoneNumber', phoneNumber);
												wx.setStorageSync('openId', openId);
												wx.setStorageSync('sessionKey', sessionKey);
												var userInfo = userInfoData.data;
												if(userInfo.openId != undefined){
													wx.setStorageSync('userInfo', userInfo);
													console.log("用户信息",userInfo);
													utils.default.isLogin();
													that.selectRedDotCue();
													uni.switchTab({
														url: '../home/home',
													})
												}else {
													utils.default.isLogin();
													uni.showToast({
														duration:1500,
														title: '登录失败',
														icon : 'error'
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
											// complete: ()=>{
											// 	uni.hideLoading();
											// }
										})
									},
									fail : (phoneData)=>{
										console.log('获取手机信息失败',phoneData);
										wx.navigateTo({
											url: '../login/login',
										});
										uni.hideLoading();
									},
									// complete: ()=>{
									// 	uni.hideLoading();
									// }
								})
							},
							fail: openIdData=>{
								console.log('获取openId失败',openIdData);
								wx.navigateTo({
									url: '../login/login',
								});
								uni.hideLoading();
							},
							// complete: ()=>{
							// 	uni.hideLoading();
							// }
						})
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
			
		},
		
		wxLogin() {
			wx.login({
				success: (res)=>{
					var loginCode = res.code
					console.log('微信登录授权码', loginCode);
					if (loginCode) {
						//发起网络请求
						uni.showLoading({
							title: '登陆中'
						});
						wx.request({
							url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-openId',
							method : 'POST',
							data: {
								appId : getApp().globalData.appId,
								secret : getApp().globalData.secret,
								loginCode: loginCode
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
									url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-user-info',
									data: {
										openId : openIdData.data.openid
									},
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
										wx.setStorageSync('openId', openId);
										if(userInfoData.data.openId != undefined){
											var userInfo = userInfoData.data;
											wx.setStorageSync('userInfo', userInfo);
											wx.setStorageSync('phoneNumber', userInfo.lxrPhone);
											wx.setStorageSync('sessionKey', sessionKey);
											console.log("用户信息",userInfo);
											utils.default.isLogin();
										}else {
											utils.default.isLogin();
											wx.navigateTo({
												url: '../login/login',
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
									// complete: ()=>{
									// 	uni.hideLoading();
									// }
								})
								
							},
							fail: openIdData=>{
								console.log('获取openId失败',openIdData);
								wx.navigateTo({
									url: '../login/login',
								});
								uni.hideLoading();
							},
							// complete: ()=>{
							// 	uni.hideLoading();
							// }
						  })
					} else {
						console.log('登录失败！' + res.errMsg)
					}
				}
			})
		},
		
		selectRedDotCue() {
			wx.request({
				url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-red-dot-cue',
				data: {
					openId : getApp().globalData.openId,
					clientContactId : getApp().globalData.userInfo.clientContactId,
				},
				method : 'POST',
				success : (res) => {
					if (res.statusCode != 200) {
						uni.hideLoading()
						uni.showToast({ 
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
					} else if(res.data== {}){
						wx.showToast({
							title: '未查到相关信息',
							icon: 'none',
							duration: 1500
						});
					} else {
						var data = res.data;
						Object.keys(data).forEach(k=>{
							getApp().globalData.redDotCue[k] = data[k];
							uni.$emit(k, data[k]);
						})
						var tab1Cue = getApp().globalData.redDotCue.tab1Cue;
						if (Number(tab1Cue) > 0) {
							uni.setTabBarBadge({
								index: 1,
								text: String(tab1Cue),
							});
						} else {
							uni.hideTabBarRedDot({
								index: 1
							});
						}
						uni.hideLoading()
					}
				},
				fail : (res) =>{
					resolve('fail');
					uni.hideLoading()
					uni.showToast({
						title: '网络错误',
						icon: 'error',
						duration: 1500
					})
				},
				// complete: ()=>{
				// 	uni.hideLoading();
				// }
			})
		}
	},
		
	onUnload: function () {
		wx.switchTab({
			url: '../login/login',
		});
	},
	
}