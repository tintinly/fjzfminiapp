<template>
	<view>
		<view v-if="warning" class="topTip">
			<text class="cuIcon-warn text-yellow margin-right-sm"></text><text class="">未找到所属企业，请前往<text class="text-blue" @click="toPage('../mydetail/mydetail', true)">个人信息</text>中维护</text>
		</view>
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
	import selectproject from './selectproject.js';
	import { HTTP } from '../../common/http.js';
	export default {
		data () {
			return {
				noData : true,
				projectList : [],
				clientContactId : getApp().globalData.userInfo.clientContactId,
			}
		},
		computed : {
			warning(e) {
				return this.clientContactId == undefined || this.clientContactId == '';
			},
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			var _this = this;
			uni.$on('updateUserInfo',function(e) {
				_this.clientContactId = e.clientContactId
				if (_this.clientContactId != undefined && _this.clientContactId != '') {
					_this.loadData();
				};
			});
			_this.loadData();
		},
		onUnload() {
			uni.$off('updateUserInfo');
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
			
			loadData : function(e) {
				HTTP(`/open/emc/module/bp/wechat/select-contract`,{
					clientNo : getApp().globalData.userInfo.clientNo
				}).then(res=>{
					var dataList = res.data;
					if(dataList.length == 0){
						this.projectList = []
						this.noData = true
					}else{
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
					}
				}).catch(err=>{
					var projectList = [];
					this.noData = false
				});
			}
		},
	}
</script>

<style scoped>
	@import url(../selectproject/selectproject.css);
	@import url(../../common/uni-nvue.css);
	@import url(../../common/uni.css);
</style>