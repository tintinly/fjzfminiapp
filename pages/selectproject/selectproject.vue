<template>
	<view>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		<view class="margin bg-white box-radius" v-for="item in projectList"  @tap="toPage('../projectdetail/projectdetail?projId=' + item.projId)">
			<view class="flex flex-wrap padding-xs  solid-bottom align-center radius">
				<view class="text-cut" style="flex-basis: 70% ">
					<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text><text class="text-bold">{{item.projName}}</text>
				</view>
				<view style="flex-basis: 30%">
					<view class=" fr title-text-right-text padding-lr padding-xs">{{item.projNode}}</view>
				</view>
			</view>
			<view class="grid col-1 padding-sm" >
				<view class="margin-bottom-sm"><text class="text-grey">任务编号 ：{{item.projNo}}</text></view>
				<view class=""><text class="text-grey">下达时间 ：{{item.createdTime}}</text></view>
			</view>
		</view>
		
	
	</view>
</template>

<script>
	import selectproject from './selectproject.js'
	export default {
		data () {
			return {
				noData : true,
				projectList : [],
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			wx.showLoading({
				title : '查询中'
			})
			wx.request({
				url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-contract',
				data : {
					clientNo : getApp().globalData.userInfo.clientNo
				},
				method : getApp().globalData.method,
				success : (projectList) => {
					if(projectList.statusCode != 200){
						this.projectList = []
						this.noData = true
						wx.showToast({
							title: '网络错误',
							icon: 'none',
							duration: 1500
						});
					}else if(projectList.data.length == 0){
						this.projectList = []
						this.noData = true
						wx.showToast({
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
					    wx.hideLoading()
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
		// onPullDownRefresh () {
		// 	    console.log('触发下拉刷新了')
		// },
		methods:{
			toPage : function (url){
				uni.navigateTo({
					url : url 
				})
			},
			viewReport : function(e){
				wx.request({
					url:  getApp().globalData.host + '/open/emc/module/bp/wechat/select-report',
					data : {
						projectId : e
					},
					method : getApp().globalData.method,
					success : (fileData) => {
									console.log(fileData);
						if(fileData.data != ''){
							this.downloadFile(fileData.data[0].downloadUrl);
						}else{
							wx.showToast({
								title: '所查看的报告尚未完成',
								icon: 'none',
								duration: 1500
							});
						}
					}
				})
			},
			
			downloadFile : function(downloadUrl){
				console.log(downloadUrl);
				console.log(getApp().globalData.host);
			  uni.downloadFile({
			    url: getApp().globalData.host  + downloadUrl,
			    success: function (res) {
			      console.log('downloadFile', res);
			      const filePath = res.tempFilePath
			      wx.openDocument({
			        filePath: filePath,
			        showMenu:true, //关键点
					success: function (res) {
			          wx.hideLoading()
			        },
			        fail: function (res) { 
						wx.showToast({
							title: 'pdf文件已失效',
							icon: 'none',
							duration: 2000
						});
			        },
			      })
			    }
			  });
			},
		},
	}
</script>

<style scoped>
	@import url(../selectproject/selectproject.css);
	@import url(../../common/uni-nvue.css);
	@import url(../../common/uni.css);
</style>