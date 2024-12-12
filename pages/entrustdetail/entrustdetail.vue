<template>
	<view>
		<view class="tab-tag">
			<view class="cu-capsule round">
				<view class="cu-tag " :class="[tabIndex===1 ? 'bg-blue' : 'line-blue']" @tap="switchTab" :data-id="1">
					委托详情
				</view>
				<view class="cu-tag " :class="[tabIndex===2 ? 'bg-blue' : 'line-blue']" @tap="switchTab" :data-id="2">
					关联任务
				</view>
			</view>
		</view>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		
		<view v-if="tabIndex === 1">
			<view class="box-head">
				<view class="text-sm">
					<text>委托编号：{{entrust.entrustNo}} </text>
					<view class="margin-lr-xs cu-tag round sm bg-white" @click="copy(entrust.entrustNo)">复制</view>
				</view> 
				<view class="text-sm  ">委托日期：{{entrust.createdTime}} </view>
			</view>
			<view class="margin-lr bg-white box-radius" >
				<view class="padding-lr padding-tb-xs solid-bottom"  >
					<text class="cuIcon-title text-sm text-sunway-blue margin-right-xs"></text><text class="text-lg text-bold">委托内容</text>
				</view>
				<view class="content-image " v-if="entrustImageList.length > 0">
					<view class="grid col-4 grid-square">
						<view v-for="(item,index) in entrustImageList" :key="index" :style="[{ backgroundImage:'url(' + entrustImageList[index] + ')' }]" @tap="ViewImage" :data-url="entrustImageList[index]"></view>
					</view>
				</view>
				<view class="solid-top padding-sm margin-lr">
					<view>{{entrust.entrustContent}}</view>
				</view>
			</view>
		</view>
		
		<view v-else-if="tabIndex===2">
			<view class="content-box margin-tb-sm" v-for="item in projectList"  @tap="toPage('../projectdetail/projectdetail?projId=' + item.projId)">
				<!-- <view class="content-title solid-bottom" @tap="viewReport(item.projId)" > -->
				<view class="content-title solid-bottom"  >
					<view class="title-left">
							<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text>
							<text class="text-df text-bold"> {{item.projName}}</text>
					</view>
					<view class="title-right">
						<text class=" text-sm">{{item.projNode}}</text>
					</view>
				</view>
				<view class="content-bar" >
					<view class="content-info"><text class="text-sm text-grey">任务编号 ：{{item.projNo}}</text></view>
					<view class="content-info"><text class="text-sm text-grey">下达时间 ：{{item.createdTime}}</text></view>
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
			
				entrustId : '',
				entrustImageList : [],
				entrust : {},
				
				projectList : [],
				noData : false
			}
		},
		onLoad(e) {
			console.log(e)
			this.entrustId = e.entrustId,
			this.loadEntrustDetail()
		},
		methods: {
			toPage : function (url){
				uni.navigateTo({
					url : url 
				})
			},
			copy : function(e) {
				console.log(e)
				var copyContent = e;
				uni.setClipboardData({
				    data: copyContent,
					success: function () {
						//调用方法成功
						console.log('copy success');
					}
				})
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.entrustImageList,
					current: e.currentTarget.dataset.url
				});
			},
			switchTab : function(e)	 {
				console.log(e)
				this.tabIndex = e.currentTarget.dataset.id ;
				if (this.tabIndex === 1) {
					this.noData = false
					this.loadEntrustDetail()
				} else if (this.tabIndex === 2) {
					this.noData = true
					this.selectProject()
				}
			},
			loadEntrustDetail : function() {
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-entrust-detail',
					data : {
						entrustId : this.entrustId,
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						if(res.statusCode != 200){
							this.entrustImageList = []
							this.entrust = {}
							wx.showToast({
								title: '网络错误',
								icon: 'none',
								duration: 1500
							});
						} else {
							this.entrustImageList = res.data.entrustImageList
							this.entrust = res.data.entrust
							var entrustImageList = this.entrustImageList
							var entrust = this.entrust
							for (var i = 0; i < this.entrustImageList.length; i++) {
								if(this.entrustImageList[i] === undefined) {
									this.entrustImageList[i] = '../../static/logo.png'
								} else if (this.entrustImageList[i].indexOf('http')  == -1) {
									this.entrustImageList[i] = getApp().globalData.host + this.entrustImageList[i]
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
			},
			selectProject : function() {
				uni.showLoading({
					title : '查询中'
				})
				if (this.entrust.contractId == undefined || this.entrust.contractId == '') {
					uni.hideLoading()
					this.projectList = [];
					this.noData = true
					return
				}
				wx.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-contract',
					data : {
						clientNo : getApp().globalData.userInfo.clientNo,
						entrustId : this.entrustId
					},
					method : getApp().globalData.method,
					success : (projectList) => {
						if(projectList.statusCode != 200){
							this.projectList = []
							this.noData = true
							uni.showToast({
								title: '网络错误',
								icon: 'none',
								duration: 1500
							});
						}else if(projectList.data.length == 0){
							this.projectList = []
							this.noData = true
							uni.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						}else{
							var dataList = projectList.data;
							console.log('dataList',dataList)
							var projectList = [];
							for(var i = 0 ; i < dataList.length ; i++){
								projectList[projectList.length] = {
									projId : dataList[i].projId,
									projName : dataList[i].projName,
									projNode : dataList[i].projNode,
									projNo : dataList[i].projNo !== undefined ?  dataList[i].projNo : '无',
									createdTime : dataList[i].createdTime,
									fileList : dataList[i].projFile
								}
							}
							this.projectList = projectList;
							this.noData = false
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
	.error-bg {
		position: absolute;
		width: 150px;
		top: 50%;
			left:50%;
			transform: translate(-50%,-50%);
	}
	
	.tab-tag {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
	}
	
	.box-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between; ;
		align-items: center;
		padding: 3px 27rpx;
	}
	
	.content-box {
		margin-left: 27rpx;
			margin-right: 27rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}
	
	.content-title {
		display: flex;
		padding: 8px 10px;
		align-items: center;
		/* border-radius: 16rpx; */
		/* min-height: 70upx; */
		justify-content: space-between; 
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}
	
	.title-left {
		width: 250px;
		text-overflow: ellipsis;
		white-space: nowrap; 
		overflow: hidden;
	}
	.title-right {
		width: 60px;
		height: 22px;
		 line-height: 22px;
		text-align: center;
		color: #497e7e;
		background-color: #d9f8fa;
	}
	
	.content-bar {
		padding: 2px 30px;
	}
	.content-info {
		margin : 8px 0px;
	}
	
	.content-image {
		padding: 10px 20px;
		align-items: center;
	}

	.content-text{
		padding: 10px 20px;
		align-items: center;
	}
	
</style>
