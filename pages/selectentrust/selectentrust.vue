<template>
	<view>		
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="1==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="1">
					未受理
				</view>
				<view class="cu-item flex-sub" :class="2==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="2">
					已受理
				</view>
				<view class="cu-item flex-sub" :class="3==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="3">
					已完成
				</view>
			</view>
		</scroll-view>
		
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		
		<view class="margin bg-white box-radius" v-for="item in entrustList"  @tap="toPage('../entrustdetail/entrustdetail?entrustId=' + item.id)">
			<view class="padding-lr padding-tb-xs solid-bottom"  >
				<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text><text class="text-df text-grey">{{item.entrustNo}}</text>
			</view>
			<view class="padding flex" >
				<view class="margin-right-sm">
					<image class="thumb-image" :src="item.ext$.thumburl" ></image>
				</view>
				<view class="text-box">
					<text>{{item.entrustContent}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex : 1,
				entrustList : [],
				accept : '',
				submit : '',
				noData : true
			}
		},
		onLoad(e) {
					this.selectEntrust(this.tabIndex)
		},
		methods: {
			toPage : function (url){
				uni.navigateTo({
					url : url 
				})
			},
			tabSelect(e) {
				console.log(e)
				this.tabIndex = e.currentTarget.dataset.id;
				this.selectEntrust(this.tabIndex)
			},
			selectEntrust(tabIndex) {
				if (tabIndex === 1 ) {
					this.accept = 0
					this.submit = 0
				} else if(tabIndex === 2) {
					this.accept = 1
					this.submit = 0
				} else {
					this.accept = 1
					this.submit = 1
				}
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-entrust',
					data : {
						clientContactId : getApp().globalData.userInfo.clientContactId,
						openId : getApp().globalData.openId,
						accept : this.accept, 
						submit : this.submit
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						if (res.statusCode != 200) {
							this.entrustList = []
							this.noData = true
							uni.hideLoading()
							uni.showToast({
								title: '网络错误',
								icon: 'error',
								duration: 1500
							})
						}  else if(res.data.length == 0){
							this.entrustList = []
							this.noData = true
							wx.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						} else {
							this.entrustList = res.data
							this.noData = false
							for (var i = 0; i < this.entrustList.length; i++) {
								if(this.entrustList[i].ext$.thumburl === undefined) {
									this.entrustList[i].ext$.thumburl = '../../static/logo.png'
								} else if (this.entrustList[i].ext$.thumburl.indexOf('http')  == -1) {
									this.entrustList[i].ext$.thumburl = getApp().globalData.host + this.entrustList[i].ext$.thumburl
								}
							}
							uni.hideLoading()
						}
						
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
			}
		}
	}
</script>

<style>
	.box-radius {
	    border-radius: 16rpx;
	    box-shadow: 10rpx 10rpx 5rpx rgba(39, 48, 57, 0.05);
	}
	.bg-img {
		position: absolute;
		width: 300rpx;
		top: 50%;
			left:50%;
			transform: translate(-50%,-50%);
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
	
	.content-bar {
		display: flex;
		align-items: center;
		padding: 10px 10px;
	}
	
	.title-left {
		display: flex;
		align-items: center;
	}
	
	.image-left {
		width: 50px;
		height: 50px;
	}
	.thumb-image {
		width: 100rpx;
		height: 100rpx;
	}
	
	.text-box {
		overflow: hidden;
		display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
		-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
		-webkit-line-clamp: 3; /** 显示的行数 **/
	}
</style>
