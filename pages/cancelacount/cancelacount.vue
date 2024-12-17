<template>
	<view class="container">
		<uni-card class="info-card" :is-shadow="true" is-full>
			<uni-icons type="info" size="18"></uni-icons>
			<text class="uni-h6">仅注销用户信息，不影响企业信息</text>
		</uni-card>

		<button type="warn" class="button" @click="cancelAcount">注销账号</button>
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
									utils.isLogin();
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
	.container {
		padding: 15px;
		background-color: #fff;
	}
	
	.button{
		border-radius: 80rpx;
		margin: 30rpx 50rpx;
		font-size: 35rpx;
		background-color: cornflowerblue;
	}
	
	.info-card {
		padding-left: 20rpx;
	}
</style>
