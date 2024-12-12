const utils = require('../../common/util.js');
export default {
	methods: {
		login() {
			wx.login({
				success: (res)=>{
					var loginCode = res.code
					if (loginCode) {
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
									url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
									data: {
										openId : openIdData.data.openid,
										phoneNumber: phoneNumber
									},
									method : 'POST',
									success: (clientData) =>{
										console.log("clientData",clientData)
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
											console.log("userInfo",userInfo);
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
										console.log('openIdData',openIdData);
										console.log('res',res);
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
								console.log('res',res);
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
		}
	},
	
	
}