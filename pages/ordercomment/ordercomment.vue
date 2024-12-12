<template>
	<view>
		<!-- 这里是固定的导航栏 -->
		<view class="nav-bar-top" :style="'height:' + navHeight + 'px;' + 'border-width : ' + navBorder +'px;' ">
			<view class="nav-bar" :style="'top:' + statusbarHeight + 'px;' + 'height:' + nav + 'px'" >
				<view class="back-button"  @click="back">
					<uni-icons   custom-prefix="iconfont" type="icon-31fanhui1" size="20" color="white" ></uni-icons>
				</view>
				<view class="nav-title" >
					<text class="text-xl text-white">订单评价</text>
				</view>
			</view>
		</view>
		
		<view class="content-center" :style="'margin-top : ' + (navHeight + navBorder * 2) + 'px;'">
			<view class="margin bg-white box-radius">
				<view class="flex  padding solid-bottom">
					<view class="flex-sub text-bold ">合作渠道</view>
					<view class="flex-sub">
						<picker class="fr" @change="coChannelSelect" :value="coChannelIndex" :range="coChannelList">
							{{coChannel?coChannel:'请选择'}}<text class="cuIcon-right"></text>
						</picker>
					</view>
				</view>
				<view class="flex flex-wrap padding solid-bottom">
					<view class="basis-xs text-bold ">建议意见</view>
					<input class="basis-lg padding-left" v-bind:disabled="readonly" v-model="feedbackContent" type="text" :placeholder="readonly ? '' : '请输入...'"/>
				</view>
			</view>
			
			<view class="margin bg-white box-radius" v-for="item in commentList">
				<view class="flex  padding solid-bottom">
					<view class="flex-sub "><text>{{item.commentTitle}}: </text></view>
					<view class="flex-sub">
						<uni-rate class="fr" @change="rateChange" :readonly="readonly" color="#bbb"  v-model="item.commentLevel"  />
					</view>
				</view>
				<view class="padding" >
					  <textarea v-bind:disabled="readonly" name="opinion" maxlength="200" v-model="item.comment" auto-height style="height: 100px;" placeholder-class="placeholder" :placeholder="readonly ? '' : '展开描述......'"/>
				</view>
			</view>
		
			<view class="padding-bottom-xs">
				<button v-if="!readonly" class="button " :class="submitable ? 'bg-sunway-blue' : 'bg-sunway-grey'" @click="submit"><text class="text-white">提交</text></button>
			</view>
		</view>
	</view>
</template>

<script>
	import loginjs from '../login/login.js'
	export default {
		data() {
			return {
				//导航栏相关
				navBorder : 2,
				nav : getApp().globalData.nav,
				navHeight	 : getApp().globalData.navHeight,
				statusbarHeight : getApp().globalData.navHeight - getApp().globalData.nav,
				// 底部相关
				unSafeButtomHeight : getApp().globalData.unSafeButtomHeight,
				btnGroupHeight : 40,
				// 交互相关
				submitable : false,
				readonly : true,
				// 数据相关
				wxOrderId : '',
				coChannel : '',
				coChannelIndex : 0,
				coChannelList : ['指定','推荐','介绍'],
				feedbackContent : '',
				commentList : [{
					commentTitle : '现场检测行为的规范性',
					commentLevel : 0,
					comment: '',
				},{
					commentTitle : '报告内容的准确性',
					commentLevel : 0,
					comment: '',
				},{
					commentTitle : '报告发放的高效性',
					commentLevel : 0,
					comment: '',
				},{
					commentTitle : '与您沟通的有效性',
					commentLevel : 0,
					comment: '',
				},{
					commentTitle : '服务态度和精神面貌',
					commentLevel : 0,
					comment: '',
				}],
				rateTextList : ['非常不满意','不满意','一般','基本满意','非常满意'],
			}
		},
		onLoad(e) {
			this.wxOrderId = e.wxOrderId
			this.longin = e.longin
			if (getApp().globalData.UserLogin == false) {
				loginjs.methods.wxLogin();
			}
			this.selectOrderComment(e.wxOrderId)
		},
		methods: {
			// 评分变化
			rateChange(e) {
				if (this.commentList.every(e=>e.commentLevel > 0 )) {
					this.submitable = true;
				}
			},
			//点击下拉列表
			coChannelSelect(e) {
				this.coChannelIndex = e.target.value;
				this.coChannel = this.coChannelList[e.target.value]
			},
			back : function(e) {
				if (getCurrentPages().length > 1) {
					// 在C页面内 navigateBack，将返回A页面
					uni.navigateBack({
						delta: 1
					});
				} else {
					wx.reLaunch({
						url : '../home/home'
					})
				}
			
			},
			submit : function (e) {
				var that = this;
				if (!this.submitable) {
					return;
				}
				uni.showLoading({
					title : '加载中'
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/submit-feedback',
					data : {
						openId : getApp().globalData.openId,
						clientId : getApp().globalData.userInfo.clientId,
						clientContactId : getApp().globalData.userInfo.clientContactId,
						commentList : this.commentList,
						feedbackContent : this.feedbackContent,
						coChannel : this.coChannel,
						wxOrderId : this.wxOrderId
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
							that.back();
							uni.$emit('refreshOrder', {})
							loginjs.methods.selectRedDotCue(); // 评价后 更新订单待评价数量
							uni.showToast({
								title: '评价成功',
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
			},
			selectOrderComment: function(wxOrderId) {
				
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-feedback',
					data : {
						wxOrderId : wxOrderId,
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						var feedbackList = res.data.feedbackList
						if (feedbackList.length == 0) {
							this.readonly = false;
						} else {
							this.readonly = true;
							this.coChannel = feedbackList[0].coChannel;
							this.feedbackContent = feedbackList[0].feedbackContent;
							var feedbackLineList = feedbackList[0].feedbackLineList ;
							for(let i=0;i < feedbackLineList.length;i++){
								if (i < this.commentList.length) {
									this.commentList[i].commentTitle = feedbackLineList[i].commentTitle;
									this.commentList[i].commentLevel = feedbackLineList[i].commentLevel;
									this.commentList[i].comment = feedbackLineList[i].comment;
								} else {
									var obj = {
										commentTitle : feedbackLineList[i].commentTitle,
										commentLevel : feedbackLineList[i].commentLevel,
										comment : feedbackLineList[i].comment,
									}
									this.commentList.push(obj)
								}
							}
						};
						uni.hideLoading()
					},
					fail : (res) =>{
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
					}
				})
			},
		}
	}
</script>

<style>
	.box-radius {
	    border-radius: 16rpx;
	    box-shadow: 10rpx 10rpx 5rpx rgba(39, 48, 57, 0.05);
	}
	.nav-bar-top {
		 z-index: 1;
		width: 100%;
		position:fixed;
		background-color: #3881ed;
		border-style :solid ;
		border-color: #3881ed;
		top : 0px  /* 使fixed位置生效 */
	}
	
	.nav-bar {
		width: 100%;
		position:fixed;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* border: 2px solid; */
	}
	
	.nav-title {
			position:absolute;
			left: 50%;    /* 起始是在body中，横向距左50%的位置 */
			transform:translate(-50%); /* 水平、垂直都居中,也可以写成下面的方式 */
			text-align: center;
	}
	
	
	.back-button {
		position:absolute;
		left: 1%;    
	}
	
	.content-center {
		padding-top : 15rpx;
		padding-bottom : 15rpx;
	}
	textarea {
	    min-height: 60rpx;
	    width: 100%;
	}
	.content-box {
		margin: 16rpx 27rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}
	.content-comment {
		padding: 15px;
	}
	.content-rate {
		padding: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.content-detail{
		padding: 5px;
	}
	.content-row {
	    height: 45px;
	    border-bottom: 1rpx #f0f0f0 solid;
		display: flex;
		flex-direction: row;
	}
	
	.content-text {
		width: 60px;
		font-size:13px;
		line-height: 45px;
		padding-left: 20px;
		text-align: left;
		font-weight: bold;
	}
	
	.content-input {
		width: 240px;
		padding-left: 10px;
		padding-top: 11px;
		font-size:13px;
	}
	.button{
		border-radius: 80rpx;
		margin: 40rpx 40rpx;
		font-size: 35rpx;
	}
	.content-text2 {
		width: 130px;
		font-size:13px;
		line-height: 45px;
		padding-left: 20px;
		text-align: left;
		font-weight: bold;
	}
	.option-row {
	    height: 45px;
	    border-bottom: 1rpx #f0f0f0 solid;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
