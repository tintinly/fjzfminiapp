<template>
	<view>
		<sunway-navbar :backShow="true" :titleShow="true" :title="modelName"></sunway-navbar>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		
		
		
		<checkbox-group @change="checkboxChange">
			<view class="bg-white margin radius " v-for="item in contractList"  @tap="">
				<view class="flex padding align-center justify-between" >
					<view class="padding-lr">
						<view class="">合同编号 ：{{item.contractNo}}</view>
						<view class="margin-top-sm ">合同名称 ：{{item.contractName}}</view>
						<view class="margin-top-sm ">合同类型 ：{{item.contractCategory}}</view>
						<view class="margin-top-sm ">总价 ：{{item.totalPrice ? item.totalPrice : '0' }}元</view>
					</view>
					<view class=" ">
						<view><checkbox :value="item.id" :checked="false"/></view>
					</view>
				</view>
			</view>
		</checkbox-group>
		
		<!-- 底部按钮栏 -->
		<view class="margin-top" :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  "></view>
		<view class="btn-group-bottom " :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
			<view class="flex justify-end" :style="'height:' + (btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
				<button class="button bg-sunway-blue text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="pass" >通过</button>
				<!-- <button class="button  bg-red text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="reject" >拒绝</button> -->
			</view>
		</view>
	</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
				modelName : '',
				bpmn_statusCode : '',
				
				contractList : [],
				checkedContractIdList : [],
				noData : true,
				
				// 底部相关
				unSafeButtomHeight : getApp().globalData.unSafeButtomHeight,
				btnHeight : 40,
				btnMargin : 10,
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			this.modelName = options.modelName
			var jsonObject = JSON.parse(options.jsonParam);
			this.bpmn_statusCode = jsonObject.bpmn_statusCode;
			this.loadData();
		},
		methods: {
			loadData() {
				uni.showLoading({
					title: '查询中...',
				});
				wx.request({
					url: getApp().globalData.host + '/secure/emc/module/mdm/contracts/queries/tasks?loginType=wxmpsso&openId=' + getApp().globalData.openId,
					method : 'post',
					data: {
					  p: {
						f: {
						  bpmn_statusCode: this.bpmn_statusCode,
						},
						n: -1,
					  }
					},
					success: (contractRes) =>{
						console.log("查询合同审批", contractRes);
						if(contractRes.statusCode != 200){
							this.contractList = []
							this.noData = true
							wx.showToast({
								title: '网络错误',
								icon: 'none',
								duration: 1500
							});
						}else if(contractRes.data.rows.length == 0){
							this.contractList = []
							this.noData = true
							wx.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						} else {
							this.noData = false;
							this.contractList = contractRes.data.rows
							this.contractList.forEach(e=>{
								if (e.contractCategory == 'virtual') {
									e.contractCategory = '虚拟合同'
								} else if(e.contractCategory == 'temp') {
									e.contractCategory = '临时合同'
								} else if(e.contractCategory == 'formal') {
									e.contractCategory = '正式合同'
								} else {
									e.contractCategory = '无'
								}
							});
						}
						uni.hideLoading();
						
					},
					fail: contractRes=>{
						console.log('查询合同审批',contractRes);
						uni.showToast({
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
						uni.hideLoading();
					}
				});
			},
			checkboxChange(e) {
				console.log(e);
				var value = e.detail.value; 
				this.checkedContractIdList = value;
				console.log(this.checkedContractIdList);
			},
			// 跳转函数
			toPage: function (url) {
				uni.navigateTo({
					url: url
				})
			},
			pass: function () {
				var checkedContractIdList = this.checkedContractIdList;
				if (checkedContractIdList == undefined || checkedContractIdList.length == 0) {
					return;
				}
				var auditData = [];
				checkedContractIdList.forEach(e=>{
					auditData.push({
						id : e
					})
				})
				wx.request({
					url: getApp().globalData.host + '/secure/emc/module/mdm/contracts/action/complete-task?loginType=wxmpsso&openId=' + getApp().globalData.openId,
					method : 'PUT',
					data: {
					  p: {
						"bpmn_comment": "微信已阅"
					  },
					  b: [
						"",
						auditData
					  ]
					},
					success: (contractRes) =>{
						console.log("查询合同审批", contractRes);
						if(contractRes.statusCode != 200){
							wx.showToast({
								title: '网络错误',
								icon: 'none',
								duration: 1500
							});
						}else {
							wx.showToast({
								title: '操作成功',
								icon: 'none',
								duration: 1500
							});
							this.loadData();
						}
						uni.hideLoading();
					},
					fail: contractRes=>{
						console.log('查询合同审批',contractRes);
						uni.showToast({
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
						uni.hideLoading();
					}
				});
			},
			reject: function () {
				var checkedContractIdList = this.checkedContractIdList;
				if (checkedContractIdList == undefined || checkedContractIdList.length == 0) {
					return;
				}
				var auditData = [];
				checkedContractIdList.forEach(e=>{
					auditData.push({
						id : e
					})
				})
				wx.request({
					url: getApp().globalData.host + '/secure/emc/module/mdm/contracts/action/reject-task?loginType=wxmpsso&openId=' + getApp().globalData.openId,
					method : 'PUT',
					data: {
					  p: {
						"bpmn_comment": "微信已阅拒绝"
					  },
					  b: [
						"",
						auditData
					  ]
					},
					success: (contractRes) =>{
						console.log("查询合同审批", contractRes);
						if(contractRes.statusCode != 200){
							wx.showToast({
								title: '网络错误',
								icon: 'none',
								duration: 1500
							});
						}else {
							wx.showToast({
								title: '操作成功',
								icon: 'none',
								duration: 1500
							});
							this.loadData();
						}
						uni.hideLoading();
					},
					fail: contractRes=>{
						console.log('查询合同审批',contractRes);
						uni.showToast({
							title: '网络错误',
							icon: 'error',
							duration: 1500
						})
						uni.hideLoading();
					}
				});
			},
		}
	}
</script>

<style>
	@import url(../selectcontractaudit/selectcontractaudit.css);
</style>
