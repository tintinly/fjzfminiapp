<template>
    <view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="0==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="0">
					全部
				</view>
				<view class="cu-item flex-sub" :class="1==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="1">
					已取消
				</view>
				<view class="cu-item flex-sub" :class="2==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="2">
					待支付
				</view>
				<view class="cu-item flex-sub" :class="3==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="3">
					待评价
					<view class="tab-tag" v-if="toCommentSize > 0" >
						<block v-if="toCommentSize!=1">{{toCommentSize>99?'99+':toCommentSize}}</block>
					</view>
				</view>
			</view>
		</scroll-view>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
	
		<view class="margin bg-white box-radius" v-for="item in wxOrderList"  @tap="toPage('../orderdetail/orderdetail?wxOrderId=' + item.id)">
			<view class="flex padding-xs solid-bottom">
				<view class="flex-tre" v-if="item.isSampleType == '1'">
					<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text>
					<text class="text-df text-bold"> {{item.testOrgName}}（采样任务）</text>
				</view>
				<view class="flex-tre" v-else>
					<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text>
					<text class="text-df text-bold"> {{item.testOrgName}}（送样任务）</text>
				</view>
				<view class="flex-sub">
					<view class="fr">
						<text class="text-sm text-grey">{{tradeStateNameList[tradeStateList.indexOf(item.tradeState)]}}</text>
						<text class="text-tag"  v-if="item.comment != '1' && item.tradeState == 'SUCCESS'" ></text>
					</view>
				</view>
			</view>
			<view class="grid col-1 padding-sm" >
				<view class="margin-bottom-sm"><text class="text-sm text-grey">订&nbsp;&nbsp;单&nbsp;&nbsp;号：{{item.outTradeNo}}</text></view>
				<view class="margin-bottom-sm"><text class="text-sm text-grey">下单时间：{{item.createdTime}}</text></view>
				<view class="" v-if="item.isSampleType == '1'"><text class="text-sm text-grey">点&nbsp;&nbsp;位&nbsp;&nbsp;数：{{item.ext$.num}}个</text></view>
				<view class="" v-else><text class="text-sm text-grey">样&nbsp;&nbsp;品&nbsp;&nbsp;数：{{item.ext$.num}}个</text></view>
			</view>
		</view>
	
    </view>
</template>


<script>
	export default {
		data() {
			return {
				//导航栏相关
				nav : getApp().globalData.nav,
				navHeight	 : getApp().globalData.navHeight,
				statusbarHeight : getApp().globalData.navHeight - getApp().globalData.nav,
				noData : true,
				tabIndex : 0,
				tabIndexList : [0,1,2,3],
				tradeStateList : ['CLOSED','NOTPAY','SUCCESS','REFUND','HISTORY'],
				tradeStateNameList : ['已取消','待支付','支付成功','已退款','历史订单'],
				wxOrderList : [],
				toCommentSize : 0
			}
		},
		onLoad(e) {
			var that = this
			console.log(e);
			if (this.tabIndexList.indexOf(Number(e.tabIndex)) > -1) {
				this.tabIndex = e.tabIndex;
			}
			this.selectOrder(this.tabIndex)
			uni.$on('refreshOrder',function(callback) {
				console.log('触发了刷新订单事件')
				that.selectOrder(that.tabIndex, callback)
			})
		},
 		methods: {
			toPage : function (url){
				uni.navigateTo({
					url : url 
				})
			},
			back : function(e) {
			// 在C页面内 navigateBack，将返回A页面
				uni.navigateBack({
					delta: 1
				});
			},
			tabSelect(e) {
				this.tabIndex = e.currentTarget.dataset.id;
				this.selectOrder(this.tabIndex)
			},
			selectOrder(tabIndex, callback) {
				var tradeState;
				var comment;
				if (tabIndex == 0) {
					tradeState = undefined
					comment = undefined
				} else if (tabIndex == 1) {
					tradeState = 'CLOSED'
					comment = undefined
				} else if (tabIndex == 2) {
					tradeState = 'NOTPAY'
					comment = undefined
				} else if (tabIndex == 3) {
					tradeState = 'SUCCESS'
					comment = '0'
				}
				
				
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-wx-order',
					data : {
						clientContactId : getApp().globalData.userInfo.clientContactId,
						openId : getApp().globalData.openId,
						tradeState : tradeState,
						comment : comment,
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						if (res.statusCode != 200) {
							this.wxOrderList = []
							this.noData = true
							uni.hideLoading()
							uni.showToast({
								title: '网络错误',
								icon: 'error',
								duration: 1500
							})
						} else if(res.data.length == 0){
							this.wxOrderList = []
							this.noData = true
							wx.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						} else if(res.data.wxOrderList.length == 0){
							this.wxOrderList = []
							this.noData = true
							wx.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						} else {
							this.noData = false
							this.wxOrderList = res.data.wxOrderList
							this.toCommentSize = res.data.toCommentSize
							if (callback != undefined) {
								callback(this.toCommentSize)
							}
							getApp().globalData.toCommentSize = res.data.toCommentSize
							uni.hideLoading()
						}
						console.log(res)
						
					},
					fail : (res) =>{
						this.noData = true
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
					}
				})
			}
		}
	}
</script>

<style>
	.bg-img {
		position: absolute;
		width: 300rpx;
		top: 50%;
			left:50%;
			transform: translate(-50%,-50%);
	}
	.box-radius {
	    border-radius: 16rpx;
	    box-shadow: 10rpx 10rpx 5rpx rgba(39, 48, 57, 0.05);
	}
	.content-box {
		margin: 15rpx 27rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}
	.content-title {
		display: flex;
		padding: 10px 10px;
		align-items: center;
		/* border-radius: 16rpx; */
		/* min-height: 70upx; */
		justify-content: space-between; 
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}
	.title-left {
		display: flex;
		align-items: center;
	}
	.title-right {
		display: inline-block;
		flex : 1;
	}
	.content-bar {
		padding: 5px 30px;
	}
	.content-info {
		margin : 3px 0px;
	}
	.tab-tag {
		font-size: 20upx;
		vertical-align: middle;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		font-family: Helvetica Neue, Helvetica, sans-serif;
		white-space: nowrap;
		
		border-radius: 200upx;
		position: absolute;
		/* top: -10upx; */
		/* right: -10upx; */
		padding: 0upx 10upx;
		height: 20upx;
		color: #ffffff;
		background-color: #dd514c;
	}
	.text-tag {
		font-size: 20upx;
		vertical-align: middle;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		font-family: Helvetica Neue, Helvetica, sans-serif;
		white-space: nowrap;
		
		border-radius: 200upx;
		/* position: absolute; */
		/* top: -10upx; */
		/* right: -10upx; */
		padding: 0upx 10upx;
		height: 20upx;
		color: #ffffff;
		background-color: #dd514c;
	}
</style>