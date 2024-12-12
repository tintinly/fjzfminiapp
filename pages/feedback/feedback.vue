<template>
	<view>
		 <view class="content_wrap">
			  <view class="content">
				  <textarea name="opinion" @input="spyInput" maxlength="200" :value="feedbackContent" auto-height placeholder-class="placeholder" placeholder="期待您的反馈，我们将会不断改进" />
				  <view class="word-count">
					{{wordCount}}/200
				  </view>
			  </view>
			 
		  </view>
		<button class="button bt-sunway-blue" @click="submit"><text>提交</text></button>
	
		<button class="menuButton" open-type="feedback"><text class="text-lg">微信官方反馈</text></button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				feedbackContent : '',
				wordCount : 0
			}
		},
		methods: {
			spyInput:function(e){
				console.log(e)
			   this.wordCount = e.detail.cursor
			   this.feedbackContent = e.detail.value
			},
			submit : function (e) {
				uni.showLoading({
					title : '加载中'
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/submit-feedback',
					data : {
						feedbackContent : this.feedbackContent,
						openId : getApp().globalData.openId,
						clientId : getApp().globalData.userInfo.clientId,
						clientContactId : getApp().globalData.userInfo.clientContactId
						
					},
					method : getApp().globalData.method,
					success : (res) => {
						if(res.statusCode != 200){
							uni.hideLoading()
							uni.showToast({
								title: '发生错误',
								icon: 'none',
								duration: 1500
							});
						}else{
						    uni.hideLoading()
							uni.navigateBack()
							uni.showToast({
								title: '反馈成功',
								icon: 'sucess',
								duration: 1500
							});
						}
					},
					fail : (res) => {
						uni.hideLoading()
						uni.showToast({
							title: '网络错误',
							icon: 'none',
							duration: 1500
						});
					}
				})
			}
		}
	}
</script>

<style>
	@import url(../feedback/feedback.css);
</style>
