	const utils = require('../../common/util.js');
	export default {
		methods: {
			login() {
				wx.getUserProfile({
					desc: '用于完善会员资料',//声明获取用户个人信息后的用途，后续会展示在弹窗中
					success:(res) =>{
						wx.login({
							success:(loginData)=>{
								uni.showLoading({
									title: '登陆中'
								});
								var code = loginData.code;
								wx.request({
									url: getApp().globalData.host + '/open/emc/module/bp/wechat/get-openId',
									method : 'POST',
									data : {
										appId : getApp().globalData.appId,
										secret : getApp().globalData.secret,
										loginCode : code,
									},
									success:(openIdData)=>{
										wx.request({
											url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
											data: {
												openId : openIdData.data.openid
											},
											method : 'POST',
											success: (clientData) =>{
												var openId = openIdData.data.openid;
												wx.setStorageSync('openId', openId);
												if(clientData.data.clientId != undefined){
													var userInfo = clientData.data;
													wx.setStorageSync('userInfo', userInfo);
													console.log("用户信息",userInfo);
													utils.default.IsLogon();
													wx.switchTab({
														url: '../home/home',
													})
												}else {
													utils.default.IsLogon();
													wx.navigateTo({
														url: '../mydetail/mydetail',
													})
												}
												uni.hideLoading();
											},
											fail: clientData=>{
												console.log('获取用户信息失败',clientData);
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
									}
								})
								fail: loginData=>{
									console.log('登录失败',loginData);
									wx.navigateTo({
										url: '../login/login',
									});
									uni.hideLoading();
								}
							}
						})
						fail: res=>{
							console.log('授权失败',res);
							wx.navigateTo({
								url: '../login/login',
							});
							uni.hideLoading();
						}
					}
				})
			},
			
			
			getPhoneNumber(e) {
				var that = this;
				var errMsg = e.detail.errMsg
				if (errMsg.indexOf("fail") > -1) {
					uni.showToast({
						icon: 'none',
						title: '用户拒绝微信手机协议，请重新授权',
						duration: 1500
					});
					return
				}
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
											var phoneNumber = phoneData.data.phone_info.phoneNumber
											wx.request({
												url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
												data: {
													openId : openIdData.data.openid,
													phoneNumber: phoneNumber
												},
												method : 'POST',
												success: (clientData) =>{
													console.log("用户信息",clientData)
													if (clientData.statusCode === 500 || clientData.statusCode === 404) {
														uni.showToast({
															duration:1500,
															title: '网络错误',
															icon : 'error'
														})
													}
													var openId = openIdData.data.openid;
													wx.setStorageSync('phoneNumber', phoneNumber);
													wx.setStorageSync('openId', openId);
													if(clientData.data.clientId != undefined){
														var userInfo = clientData.data;
														wx.setStorageSync('userInfo', userInfo);
														console.log("用户信息",userInfo);
														utils.default.IsLogon();
														that.selectRedDotCue();
														wx.switchTab({
															url: '../home/home',
														})
													}else {
														utils.default.IsLogon();
														wx.navigateTo({
															url: '../logon/logon',
														})
													}
													uni.hideLoading();
												},
												fail: clientData=>{
													console.log('获取用户信息失败',clientData);
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
											console.log('获取手机信息失败',clientData);
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
										url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
										data: {
											openId : openIdData.data.openid
										},
										method : 'POST',
										success: (clientData) =>{
											console.log("用户信息",clientData)
											if (clientData.statusCode === 500 || clientData.statusCode === 404) {
												uni.showToast({
													duration:1500,
													title: '网络错误',
													icon : 'error'
												})
											}
											var openId = openIdData.data.openid;
											wx.setStorageSync('openId', openId);
											if(clientData.data.clientId != undefined){
												var userInfo = clientData.data;
												wx.setStorageSync('userInfo', userInfo);
												wx.setStorageSync('phoneNumber', userInfo.lxrPhone);
												console.log("用户信息",userInfo);
												utils.default.IsLogon();
											}else {
												utils.default.IsLogon();
												wx.navigateTo({
													url: '../login/login',
												})
											}
											uni.hideLoading();
										},
										fail: clientData=>{
											console.log('获取用户信息失败',clientData);
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