<template>
	<view>
		<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg">
			<view class="cu-item arrow" @click="cancelAcount">
				<view class="content">
					<text class="cuIcon-deletefill text-sunway-blue"></text>
					<text class="text-black">账号注销</text>
				</view>
			</view>
		</view>
		<button type="warn" class="button" @click="logout">退出登陆</button>
	</view>
</template>

<script>
	import utils from '../../common/util.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			logout : function(e) {
				uni.showLoading({
					title: '正在退出'
				});
				getApp().globalData.openId = ''
				getApp().globalData.phoneNumber = ''
				getApp().globalData.userInfo = []
				try {
					uni.clearStorageSync();
				} catch (e) {
					// error
				}
				utils.IsLogon();
				var UserLogin = getApp().globalData.UserLogin;
				if(!UserLogin){
					uni.hideLoading()
					wx.reLaunch({
					  url: '../login/login',
					})
				}
			},
			cancelAcount : function(e)	{
				uni.showModal({
					title: '确认',
					content: '是否确认注销当前账号',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading({
								title: '正在注销'
							});
							wx.request({
								url : getApp().globalData.host + '/open/emc/module/bp/wechat/cancel-account',
								data : {
									openId : getApp().globalData.openId,
									phoneNumber : getApp().globalData.phoneNumber
								},
								method : 'POST',
								success : res=>{
									console.log("cancelAcount", res)
								
									uni.clearStorageSync();					
									utils.IsLogon();
									var UserLogin = getApp().globalData.UserLogin;
									if(!UserLogin){
										uni.hideLoading()
										uni.reLaunch({
										  url: '../login/login',
										})
										uni.showToast({
											title: '账号已注销',
											duration: 1000
										});
									} else{
										uni.hideLoading()
										uni.showToast({
											title: '注销失败',
											duration: 1000
										});
									}
								},
								fail : res=>{
									uni.hideLoading()
									uni.showToast({
										title: '注销失败',
										duration: 1000
									});
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			
			}
		}
	}
</script>

<style>
	@import url(../option/option.css);
</style>
