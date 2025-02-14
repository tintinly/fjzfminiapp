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
						<view class="bg-img" v-for="(item,index) in entrustImageList" :key="index" @tap="ViewImage" :data-url="entrustImageList[index]">
							<image :src="entrustImageList[index]" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="solid-top padding-sm margin-lr">
					<view>{{entrust.entrustContent}}</view>
				</view>
			</view>
		</view>
		
		<view v-else-if="tabIndex===2">
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
		
	</view>
</template>

<script>
	import { HTTP } from '../../common/http.js';
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
					this.noData = false;
					this.loadEntrustDetail();
				} else if (this.tabIndex === 2) {
					this.noData = true;
					this.projectList = [];
					this.selectProject();
				}
			},
			loadEntrustDetail : function() {
				HTTP(`/open/emc/module/bp/wechat/select-entrust-detail`,{
					entrustId : this.entrustId
				}).then(res=>{
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
				}).catch(err=>{
				});
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
				HTTP(`/open/emc/module/bp/wechat/select-contract`,{
					clientNo : getApp().globalData.userInfo.clientNo,
					entrustId : this.entrustId
				}).then(res=>{
					var dataList = res.data;
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
					this.noData = this.projectList.length == 0;
				}).catch(err=>{
					this.projectList = [];
					this.noData = true;
				});
			}
		}
	}
</script>

<style>
	@import url(../entrustdetail/entrustdetail.css);
</style>
