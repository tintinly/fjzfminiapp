<template>
	<view>
		<view class="margin-lr margin-tb-xs">		
			<view class="flex flex-wrap align-center">
				<view style="flex-basis: 60%" class="flex">
					<text class="text-sm">任务编号：{{project.projNo}}</text>
					<view class='cu-tag round sm bg-white' @tap="copy(project.projNo)">复制</view>
				</view>
				<view style="flex-basis: 40%">
					<text class=" fr text-sm ">下达时间：{{project.createdTime}}</text>
				</view>
			</view>
		</view>
		<view class="content-box">
			<view class="solids-bottom padding"  >
				<view class="text-bold text-xl text-center text-cut padding-bottom-sm solid-bottom" >{{project.projName}}</view>
				<view class="text-df text-black padding-tb-sm">合同名称：{{contract.contractName}}</view>
				<view class="text-df text-black padding-bottom-sm">委托单位：{{project.entrustOrgName}}</view>
				<view class="text-df text-black padding-bottom-sm">委托日期：{{project.entrustDate}}</view>
				<view class="text-df text-black ">受检单位：{{project.testOrgName}}</view>
			</view>
			<view class="content-bar solid-bottom">
				<scroll-view scroll-x class="bg-white nav">
					<view class="flex text-center">
						<view class="cu-item flex-sub " :class="tabIndex==1?'text-sunway-blue cur':''"   @tap="tabSelect" data-id="1" >
							任务进度
						</view>
						<view class="cu-item flex-sub " :class="tabIndex==2?'text-sunway-blue cur':''"   @tap="tabSelect" data-id="2" >
							文件列表
						</view>
					</view>
					
				</scroll-view>
			</view>
			<view v-if="tabIndex==1" class="content-body" >
				<view class="cu-timeline">
					<view :class="['cu-time', lineIndex==1 ? 'text-blue':'text-grey']">任务安排</view>
					<view :class="['cu-item', lineIndex==1 ? 'text-blue':'text-grey']">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==1 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==1 ? 'line-blue':'line-grey']">{{project.ext$.projectplandate ? project.ext$.projectplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==1 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==1 ? 'line-blue':'line-grey']">{{project.ext$.projectactualdate ? project.ext$.projectactualdate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==1 ? 'bg-blue':'bg-grey']">
							<text>任务已登记，正在制定任务计划与采样人员安排。</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==2 ? 'text-blue':'text-grey']" v-if="project.sample == '1'">采样中</view>
					<view :class="['cu-item', lineIndex==2 ? 'text-blue':'text-grey']" v-if="project.sample == '1'">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==2 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==2 ? 'line-blue':'line-grey']">{{project.ext$.sampleplandate ? project.ext$.sampleplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==2 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==2 ? 'line-blue':'line-grey']">{{project.ext$.sampleactualdate ? project.ext$.sampleactualdate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==2 ? 'bg-blue':'bg-grey']">
							<text>点位现场采样、样品接收与管理</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==3 ? 'text-blue':'text-grey']">分析中</view>
					<view :class="['cu-item', lineIndex==3 ? 'text-blue':'text-grey']">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==3 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==3 ? 'line-blue':'line-grey']">{{project.ext$.analysisplandate ? project.ext$.analysisplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==3 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==3 ? 'line-blue':'line-grey']">{{project.ext$.analysisactualdate ? project.ext$.analysisactualdate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==3 ? 'bg-blue':'bg-grey']">
							<text>样品接收、制备与分析</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==4 ? 'text-blue':'text-grey']">报告编制</view>
					<view :class="['cu-item', lineIndex==4 ? 'text-blue':'text-grey']">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==4 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==4 ? 'line-blue':'line-grey']">{{project.ext$.reportplandate ? project.ext$.reportplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==4 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==4 ? 'line-blue':'line-grey']">{{project.ext$.reporteditdate ? project.ext$.reporteditdate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==4 ? 'bg-blue':'bg-grey']">
							<text>分析采样完成，等待数据整理与报告编制</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==5 ? 'text-blue':'text-grey']">报告审核</view>
					<view :class="['cu-item', lineIndex==5 ? 'text-blue':'text-grey']">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==5 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==5 ? 'line-blue':'line-grey']">{{project.ext$.reportplandate ? project.ext$.reportplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==5 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==5 ? 'line-blue':'line-grey']">{{project.ext$.reportauditdate ? project.ext$.reportauditdate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==5 ? 'bg-blue':'bg-grey']">
							<text>报告审核</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==6 ? 'text-blue':'text-grey']">报告签发</view>
					<view :class="['cu-item', lineIndex==6 ? 'text-blue':'text-grey']">
						<view class="cu-date">
							<view class="cu-capsule radius" >
								<view :class="['cu-tag', lineIndex==6 ? 'bg-blue':'bg-grey']" >计划</view>
								<view :class="['cu-tag', lineIndex==6 ? 'line-blue':'line-grey']">{{project.ext$.reportplandate ? project.ext$.reportplandate : "/"}}</view>
							</view>
							<view class="cu-capsule radius" style="margin-left: 30px;">
								<view :class="['cu-tag', lineIndex==6 ? 'bg-blue':'bg-grey']" >实际</view>
								<view :class="['cu-tag', lineIndex==6 ? 'line-blue':'line-grey']">{{project.ext$.reportissuedate ? project.ext$.reportissuedate : "/"}}</view>
							</view>
						</view>
						<view :class="['content', lineIndex==6 ? 'bg-blue':'bg-grey']">
							<text>报告签发</text> 
						</view>
					</view>
					<view :class="['cu-time', lineIndex==7 ? 'text-blue':'text-grey']">报告完成</view>
					<view :class="['cu-item', lineIndex==7 ? 'text-blue':'text-grey']">
						<view :class="['content', lineIndex==7 ? 'bg-blue':'bg-grey']">
							<text>报告完成，请查看文件列表（已盖章）文件</text> 
						</view>
					</view>
				</view>
			</view>
			
			<view v-else-if="tabIndex==2" class="content-body" >
			
				<view class="file-row" v-for="(item,index) in files" :key="index" @click="downloadFile(item.fileUrl)">
					<view class="ext-icon margin-right-sm">
						<uni-icons   custom-prefix="iconfont" :type="'icon-' + item.fileExt" color="red" size="30" ></uni-icons>
					</view>
					<view class="file-detail">
						<view class="file-name  text-df margin-bottom-xs">
							<text class="text-black">{{item.fileName}}</text>
						</view>
						<view class="file-ext text-xs">
							<text class="text-grey margin-right-xs">{{item.fileExt}}</text><text class="text-grey">{{item.fileSize}}</text>
						</view>
					</view>
				</view>
				<view v-if="files.length === 0 " class="text-center">
					暂无报告
				</view>
			</view>
	
		</view>
		
	
		
		
			
		
	</view>
</template>

<script>
	import  util from "../../common/util.js";
	import { HTTP } from '../../common/http.js';
	export default {
		data() {
			return {
				noDataBackgroud : '../../static/noData.png',
				lineIndex : 1,
				tabIndex : 1,
				project : {
					entrustOrgName : '暂无',
					entrustDate : '暂无',
					testOrgName : '暂无'
				},
				contract : {
					contractName : '暂无'
				},
				files : []
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			console.log(options)
			this.loadData(options.projId)
		},
		methods: {
			loadData(projId) {
				HTTP(`/open/emc/module/bp/wechat/select-project-detail`,{
					projectId : projId
				}).then(res=>{
					var data = res.data
					if (data.project != undefined) {
						for (let key in data.project) {
							if (data.project[key] != undefined) {
								this.project[key] = data.project[key]
							}
						}
					}
					this.files = data.projFile
					if (data.contract != undefined) {
						for (let key in data.contract) {
							if (data.contract[key] != undefined) {
								this.contract[key] = data.contract[key]
							}
						}
					}
					switch(this.project.projNode){
						case "登记":
							this.lineIndex = 1;
							break
						case "采样中":
							this.lineIndex = 2;
							break
						case "样品接收":
							this.lineIndex = 3;
							break
						case "分析中":
							this.lineIndex = 3;
							break
						case "报告编制":
							this.lineIndex = 4;
							break
						case "报告审核":
							this.lineIndex = 5;
							break
						case "报告签发":
							this.lineIndex = 6;
							break
						case "报告归档":
							this.lineIndex = 7;
							break
						default:
							this.lineIndex = 7;
							break
					}
				}).catch(err=>{
				});
			},
			tabSelect(e) {
				this.tabIndex = e.currentTarget.dataset.id;
				console.log('选择了第' + this.tabIndex+ '个')
			},
			copy(e) {
				var copyContent = e;
				uni.setClipboardData({
				    data: copyContent,
					success: function () {
						//调用方法成功
						console.log('copy success');
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
			}
		}
	}
</script>

<style lang="scss">
	.box-head {
		display: flex;
		flex-direction: row;
		height: 15px;
		.head-left {
			text-align: center;
			// font-size: smaller;
			padding: 8px 0px 0px 15px;
		}
		.head-left-tag {
			// font-size: smaller;
			padding: 7px 0px 0px 3px;
		}
		.head-right {
			text-align: center;
			// font-size: smaller;
			padding: 8px 0px 0px 60px;
		}
	}
	
	
	
	.content-box {
		margin: 0rpx 25rpx 25rpx 25rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}

	
	.content-title {
		height: 200px;
		display: flex;
		flex-direction: column;
	}


	
	.title-text {
		padding: 10px;
		width : 250px;
		align-self: center;
		font-size: large;
		text-align: center;
		font-weight: bold;
		display: -webkit-box; /*弹性伸缩盒子模型显示*/
		overflow: hidden;
		-webkit-box-orient: vertical; /*排列方式*/ 
		-webkit-line-clamp: 2; /*显示文本行数(这里控制多少行隐藏)*/
		
	}
	
	.title-row {
		padding: 10px 20px; 
		overflow: hidden;
		overflow: hidden;
	}
	
	.title-text2 {
		margin: 2px 36px;
		display: -webkit-box; /*弹性伸缩盒子模型显示*/
		-webkit-box-orient: vertical; /*排列方式*/ 
		-webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
		overflow: hidden; /*溢出隐藏*/
		width: 240px;
		height: 20px;
		font-size:12px;
		/* padding: 20px; */
		text-align: left;
		/* font-weight: bold; */
	}
	
	
	.content-body {
		// min-height: 600rpx;
		height: auto;
		padding: 10px 10px;
		/* border-radius: 16rpx; */
		border-bottom: 1rpx #f0f0f0 solid;
		display: flex;
		flex-direction: column;
		background-color: #ffffff;
	}
	
	.cu-date {
		margin: 0px 0px 10px 0;
		display: flex;
		flex-direction: row;
	}
	
	.file-row{
		height: auto;
		// height : 100rpx;
		margin: 10rpx 20rpx;
		padding : 10rpx 10rpx;
		border-radius: 5rpx;
		display: flex;
		flex-direction: row;
		background-color: #f7f7f7;
	}

	.ext-icon {
		align-self: center;
		padding: 10px 10px;
	}
	
	.file-detail {
			align-self: center;
		display: flex;
		flex-direction: column;
	}
	
	.file-name {
		overflow: hidden;
		display: -webkit-box; /*弹性伸缩盒子模型显示*/
		-webkit-box-orient: vertical; /*排列方式*/ 
		-webkit-line-clamp: 1; /*显示文本行数(这里控制多少行隐藏)*/
	}
	
	.file-ext {
	}
</style>
