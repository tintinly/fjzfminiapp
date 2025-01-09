<template>
	<view>
		<sunway-navbar :backShow="true" :titleShow="true" :title="modelName"></sunway-navbar>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		
		<checkbox-group @change="checkboxChange">
			<view class="bg-white margin radius " v-for="(item,index) in todoItemList2"  @tap="">
				<view class="flex padding align-center justify-between" >
					<view class="padding-lr">
						<view class="margin-tb-xs" v-for="(pair,index) in item"><text class="text-bold">{{pair.key}}</text> ：{{pair.value}}</view>
					</view>
					<view class=" ">
						<view><checkbox :value="todoItemList[index].id" :checked="false"/></view>
					</view>
				</view>
			</view>
		</checkbox-group>
		
		<!-- 底部按钮栏 -->
		<view class="margin-top" :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  "></view>
		<view class="btn-group-bottom " :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
			<view class="flex justify-end" :style="'height:' + (btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
				<button class="button  bg-red text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="rejectable" >拒绝</button>
				<button class="button bg-sunway-blue text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="pass" >通过</button>
				<view class="cu-modal" :class="modalName=='rejectModal'?'show':''">
					<view class="cu-dialog">
						<view class="cu-bar bg-white justify-end">
							<view class="content">选择回退节点</view>
							<view class="action" @tap="hideModal">
								<text class="cuIcon-close text-red"></text>
							</view>
						</view>
						<view >
							<radio-group class="block" @change="radioChange">
								<view class="cu-list menu text-left">
									<view class="cu-item" v-for="(item,index) in rejectableList" :key="index">
										<label class="flex justify-between align-center flex-sub">
											<view class="flex-sub">{{item.taskName}}</view>
											<radio class="round" :class="radio=='radio' + index?'checked':''" :checked="radio=='radio' + index?true:false"
											 :value="item.statusCode"></radio>
										</label>
									</view>
								</view>
							</radio-group>
						</view>
						<view class="cu-bar bg-white justify-end">
							<view class="action">
								<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
								<button class="cu-btn bg-green margin-left" @tap="reject">确定</button>
							</view>
						</view>
					</view>
				</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../common/util.js';
	import { HTTP } from '../../common/http.js';
	export default {
		data() {
			return {
				noData : false,
				modelName : '',
				tableName : '',
				serviceName : '',
				lcdpServiceName : '',
				todoItemList : [],
				todoItemList2 : [],
				checkedTodoItemIdList : [],
				todoConfigId : '',
				modalName : '',
				rejectableList : [],
				targetStatusCode : '',
				
				// 底部相关
				unSafeButtomHeight : getApp().globalData.unSafeButtomHeight,
				btnHeight : 40,
				btnMargin : 10,
			}
		},
		onLoad: function (options) {
			this.todoConfigId = options.todoConfigId
			this.modelName = options.modelName
			this.loadData();
		},
		methods: {
			loadData() {
				utils.tryLimsLogin().then(res=>{
					console.log(res);
					var header = {};
					header['Cookie'] = res;
					HTTP(`/open/emc/module/bp/wechat/select-todo-item`,{
						todoConfigId : this.todoConfigId
					}, header).then(res=>{
						if(res.data.todoItemList2.length == 0){
							this.todoItemList = []
							this.todoItemList2 = []
							this.tableName = ''
							this.serviceName = ''
							this.lcdpServiceName = ''
							this.noData = true
							wx.showToast({
								title: '未查到相关信息',
								icon: 'none',
								duration: 1500
							});
						} else {
							this.noData = false;
							this.todoItemList = res.data.todoItemList
							this.todoItemList2 = res.data.todoItemList2
							this.tableName = res.data.tableName
							this.serviceName = res.data.serviceName
							this.lcdpServiceName = res.data.lcdpServiceName
						}
					}).catch(err=>{
					});
				}).catch(err=>{
					uni.navigateTo({
						url: '../limslogin/limslogin',
					});
				});
			},
			showModal: function (modalName) {
				this.modalName = modalName;
			},
			hideModal: function () {
				this.modalName = '';
			},
			toPage: function (url, needLogin = false) {
				if(needLogin && !utils.isLogin()){
					uni.navigateTo({
						url: '../login/login?needBack=true',
					});
					return;
				}
				uni.navigateTo({
					url: url
				})
			},
			checkboxChange(e) {
				console.log(e);
				var value = e.detail.value; 
				this.checkedTodoItemIdList = value;
				console.log(this.checkedTodoItemIdList);
			},
			radioChange(e) {
				console.log(e);
				var value = e.detail.value; 
				this.targetStatusCode = value;
			},
			pass: function () {
				var checkedTodoItemIdList = this.checkedTodoItemIdList;
				if (checkedTodoItemIdList == undefined || checkedTodoItemIdList.length == 0) {
					return;
				}
				var auditData = [];
				checkedTodoItemIdList.forEach(e=>{
					auditData.push({
						id : e
					})
				})
				uni.showModal({
					title: '审核通过',
					content: '微信已阅',
					success: (res)=> {
						if (res.confirm) {
							utils.tryLimsLogin().then(res=>{
								var header = {};
								header['Cookie'] = res;
								HTTP(`/open/emc/module/bp/wechat/complete-todo-item`,{
									  serviceName: this.serviceName,
									  lcdpServiceName: this.lcdpServiceName,
									  comment: "微信已阅",
									  todoItems: auditData
								}, header).then(res=>{
									uni.$emit('updateTodo',{});
									this.loadData();
								}).catch(err=>{
								});
							}).catch(err=>{
								uni.navigateTo({
									url: '../limslogin/limslogin',
								});
							});
						} 
					}
				});
			},
			rejectable: function () {
				var checkedTodoItemIdList = this.checkedTodoItemIdList;
				if (checkedTodoItemIdList == undefined || checkedTodoItemIdList.length == 0) {
					return;
				}
				var auditData = [];
				checkedTodoItemIdList.forEach(e=>{
					auditData.push({
						id : e
					})
				})
				utils.tryLimsLogin().then(res=>{
					var header = {};
					header['Cookie'] = res;
					HTTP(`/secure/core/module/sys/bpmn-exts/options/rejectable-tasks`,{
					  p : {
						bpmn_table: this.tableName
					  },
					  b: [
						"",
						auditData
					  ]
					}, header).then(res=>{
						this.rejectableList = res.data
						this.showModal('rejectModal');
					}).catch(err=>{
					});
				}).catch(err=>{
					uni.navigateTo({
						url: '../limslogin/limslogin',
					});
				});
			},
			reject: function () {
				if (this.targetStatusCode == undefined || this.targetStatusCode == '') {
					uni.showToast({
						title: '请选择回退节点',
						icon : 'none',
						duration: 1500
					})
					return;
				}
				var checkedTodoItemIdList = this.checkedTodoItemIdList;
				if (checkedTodoItemIdList == undefined || checkedTodoItemIdList.length == 0) {
					return;
				}
				var auditData = [];
				checkedTodoItemIdList.forEach(e=>{
					auditData.push({
						id : e
					})
				})
				utils.tryLimsLogin().then(res=>{
					var header = {};
					header['Cookie'] = res;
					HTTP(`/open/emc/module/bp/wechat/reject-todo-item`,{
					  serviceName: this.serviceName,
					  lcdpServiceName: this.lcdpServiceName,
					  comment: "微信已阅",
					  todoItems: auditData,
					  targetStatusCode : this.targetStatusCode
					}, header).then(res=>{
						uni.$emit('updateTodo',{});
						this.loadData();
						this.hideModal();
					}).catch(err=>{
						this.hideModal();
					});
				}).catch(err=>{
					this.hideModal();
					uni.navigateTo({
						url: '../limslogin/limslogin',
					});
				});
			},
		}
	}
</script>

<style>
	@import url(../todoaudit/todoaudit.css);
</style>
