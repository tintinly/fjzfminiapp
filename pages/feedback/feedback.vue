<template>
	<view>
		 <view class="content_wrap">
			  <view class="content">
				  <!-- <view class="title-bar   ">
				  	<view class="margin-left">
				  		反馈与建议
				  	</view>
				  	
				  	<view class="margin-right">
				  		2/200
				  	</view>
				  </view> -->
				  <textarea name="opinion" @input="spyInput" maxlength="200" :value="feedbackContent" auto-height placeholder-class="placeholder" placeholder="期待您的反馈，我们将会不断改进" />
				  <view class="word-count">
					{{wordCount}}/200
				  </view>
			  </view>
			 
		  </view>
		<button class="button bg-sunway-blue" @click="submit"><text class="text-white">提交</text></button>
	
		<button class="menuButton" open-type="feedback"><text class="text-lg">微信官方反馈</text></button>
	</view>
</template>

<script>
	import { HTTP } from '../../common/http.js';
	export default {
		data() {
			return {
				feedbackContent : '',
				wordCount : 0
			}
		},
		methods: {
			back : function(e) {
			// 在C页面内 navigateBack，将返回A页面
				uni.navigateBack({
					delta: 1
				});
			},
			spyInput:function(e){
				console.log(e)
			   this.wordCount = e.detail.cursor
			   this.feedbackContent = e.detail.value
			},
			submit : function (e) {
				var _this = this;
				HTTP(`/open/emc/module/bp/wechat/submit-feedback`,{
					feedbackContent : this.feedbackContent,
					openId : getApp().globalData.openId,
					clientId : getApp().globalData.userInfo.clientId,
					clientContactId : getApp().globalData.userInfo.clientContactId
				}).then(res=>{
					uni.showToast({
						title: '反馈成功',
						icon: 'sucess',
						duration: 1500,
						success : res=>{
							setTimeout(function () { 
								_this.back();
							 }, 1000) 
						}
					});
				}).catch(err=>{
				});
			}
		}
	}
</script>

<style>
	
	.content_wrap{
	    background-color: #fff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}
	

	.content{
	    padding: 10rpx;
	    margin: 0 auto;
	}
	
	.title-bar {
		display: flex;
		align-items: center;
		min-height: 70upx;
		justify-content: space-between;
	}
	
	.button{
		border-radius: 80rpx;
		margin: 40rpx 50rpx;
		font-size: 35rpx;
		background-color: cornflowerblue;
	
	}
	
	textarea{
		  padding: 0rpx 20rpx;
	    min-height: 300rpx;
	    width: 100%;
	}
	
	.word-count {
		text-align: right;
		padding: 0rpx 20rpx;
	}
	
	.menuButton {
		width: 100%;
		background-color: #ffffff;
		text-align: left;
		padding: 7px 15px;
	}
</style>
