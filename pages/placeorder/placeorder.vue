<template>
	<view>
		<view class="margin bg-white box-radius">
			<view class="padding-sm solids-bottom">
				<text class="cuIcon-title text-sunway-blue padding-right-sm"></text><text class="text-bold">委托单位信息</text>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">单位名称</view>
				<input class="basis-lg padding-left" :value="entrustOrgName" @blur="setEntrustOrgName" type="text" placeholder="请输入单位名称"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold  ">单位地址</view>
				<input class="basis-lg padding-left" :value="entrustOrgAddress" @blur="setEntrustOrgAddress" type="text" placeholder="请输入单位地址"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">联&nbsp;&nbsp;系&nbsp;&nbsp;人</view>
				<input class="basis-lg padding-left" :value="entrustOrgContact" @blur="setEntrustOrgContact" type="text" placeholder="请输入联系人姓名"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">联系电话</view>
				<input class="basis-lg padding-left" :value="entrustOrgPhone" @blur="setEntrustOrgPhone" maxlength="11" type="number" placeholder="请输入联系电话"/>
			</view>
		</view>
		<view v-if="!sameTpye" class="margin bg-white box-radius">
			<view class="padding-sm solids-bottom">
				<text class="cuIcon-title text-sunway-blue padding-right-sm"></text><text class="text-bold">受检单位信息</text>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">单位名称</view>
				<input class="basis-lg padding-left" :value="testOrgName" @blur="setTestOrgName" type="text" placeholder="请输入单位名称"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold  ">单位地址</view>
				<input class="basis-lg padding-left" :value="testOrgAddress" @blur="setTestOrgAddress" type="text" placeholder="请输入单位地址"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">联&nbsp;&nbsp;系&nbsp;&nbsp;人</view>
				<input class="basis-lg padding-left" :value="testOrgContact" @blur="setTestOrgContact" type="text" placeholder="请输入联系人姓名"/>
			</view>
			<view class="flex flex-wrap padding solid-bottom">
				<view class="basis-xs text-bold ">联系电话</view>
				<input class="basis-lg padding-left" :value="testOrgPhone" @blur="setTestOrgPhone" maxlength="11" type="number" placeholder="请输入联系电话"/>
			</view>
		</view>
		<view class="margin bg-white box-radius">
			<view class="padding-sm solids-bottom">
				<text class="cuIcon-title text-sunway-blue padding-right-sm"></text><text class="text-bold">选项</text>
			</view>
			<view class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">紧急程度</text>
				</view>
				<view class="flex-sub">
					<picker class="fr" @change="urgentTypeSelect" :value="urgentTypeIndex" :range="urgentTypeList">
						{{urgentTypeIndex>-1?urgentTypeList[urgentTypeIndex]:'请选择'}}<text class="cuIcon-right"></text>
					</picker>
				</view>
			</view>
			<view class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">是否需要开票</text>
				</view>
				<view class="flex-sub ">
					<switch class=" fr" @change="needBill" color="#4aa1ed" :checked="billType" />
				</view>
			</view>
			<view class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">是否需要纸质报告</text>
				</view>
				<view class="flex-sub ">
					<switch class=" fr" @change="needPaper" color="#4aa1ed" :checked="paperType" />
				</view>
			</view>
			<view v-if="paperType" class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">收货地址</text>
				</view>
				<view class="flex-sub ">
					<input class="fr" @blur="setReceiveAddress" type="text" placeholder="请输入收货地址"/>
				</view>
			</view>
			<view class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">受检单位同委托单位</text>
				</view>
				<view class="flex-sub ">
					<switch class="fr" @change="isSame" color="#4aa1ed" :checked="sameTpye" />
				</view>
			</view>
			<view class="flex padding solid-bottom">
				<view class="flex-sub">
					<text class="text-bold">是否采样</text>
				</view>
				<view class="flex-sub ">
					<switch class="fr" @change="changeSample" color="#4aa1ed" :checked="checked" />
				</view>
			</view>
		</view>
		
		
		
		<view v-if="isSample" class="margin bg-white box-radius">
			<view class="padding-sm solids-bottom">
				<text class="cuIcon-title  text-sunway-blue padding-right-sm"></text><text class="text-bold">点位信息</text>
			</view>
			<uni-swipe-action v-for="item in folderNumberList">
				<uni-swipe-action-item :right-options="options"  @click="swipeFolder($event, item)" @change="swipeChange" >
					<view class="flex flex=wrap padding solid-bottom align-center" >
						<view class="basis-xl flex aligin-center">
							<view class="content-num-before padding-right"> 
								<view class="content-num "><view style="padding-top: 2.5px;">{{item}}</view></view>
							</view>
							<view class="grid col-1">
								<view >
									<text class="text-bold ">
									    <!-- {{folderList[item - 1].monitorTmplValue}}&nbsp;&nbsp;{{folderList[item - 1].testValue}}&nbsp;&nbsp;{{folderList[item - 1].methodValue}}&nbsp;&nbsp;{{folderList[item - 1].itemGroupValue}} -->
										{{folderList[item - 1].monitorTmplName}}&nbsp;:&nbsp;{{folderList[item - 1].testItems}}
									</text>
								</view>
								<view >
									<text class="text-grey text-df">
										{{folderList[item - 1].pointNumber}}&nbsp;&nbsp;{{folderList[item - 1].pointName}}&nbsp;&nbsp;{{folderList[item - 1].dayNumber}}天&nbsp;&nbsp;{{folderList[item - 1].frequency}}次
									</text>
								</view>
							</view>
							
						</view>
						<view class="basis-xs ">
							<view  class="fr" >
								<text class="cuIcon-edit text-grey " @tap="Navigate(`../folder/folder,${item}`)"></text>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
			<view class="flex padding solid-bottom" @tap="Navigate(`../folder/folder,${folderNumber + 1}`)">
				<view class="flex-sub">
					<text class="cuIcon-add text-sunway-blue"></text><text class="text-bold">添加点位信息</text>
				</view>
				<view class="flex-sub ">
					<text class="cuIcon-right fr"></text>
				</view>
			</view>
		</view>
		
		<view v-if="notSample" class="margin bg-white box-radius">
			<view class="padding-sm solids-bottom">
				<text class="cuIcon-title  text-sunway-blue padding-right-sm"></text><text class="text-bold">样品信息</text>
			</view>
			<uni-swipe-action v-for="item in orderNumberList">
				<uni-swipe-action-item :right-options="options"  @click="swipeOrder" @change="swipeChange" >
					<view class="flex flex-wrap padding solid-bottom align-center" >
						<view class="basis-xl flex aligin-center">
							<view class="content-num-before padding-right"> 
								<view class="content-num "><view style="padding-top: 2.5px;">{{item}}</view></view>
							</view>
							<view class="grid col-1">
								<view >
									<text class="text-bold ">
									<!-- 									{{orderList[item - 1].monitorTmplValue}}&nbsp;&nbsp;{{orderList[item - 1].testValue}}&nbsp;&nbsp;{{orderList[item - 1].methodValue}}&nbsp;&nbsp;{{orderList[item - 1].itemGroupValue}} -->
										{{orderList[item - 1].monitorTmplName}}&nbsp;:&nbsp;{{orderList[item - 1].testItems}}
									</text>
								</view>
								<view >
									<text class="text-grey text-df">
										{{orderList[item - 1].sendDate}}&nbsp;至&nbsp;{{orderList[item - 1].sampleCompleteDate}}
									</text>
								</view>
							</view>
							
						</view>
						<view class="basis-xs ">
							<view  class="fr" >
								<text class="cuIcon-edit text-grey "@tap="Navigate(`../order/order,${item}`)"></text>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			
			<view class="flex padding solid-bottom" @tap="Navigate(`../order/order,${orderNumber + 1}`)">
				<view class="flex-sub">
					<text class="cuIcon-add text-sunway-blue"></text><text class="text-bold">添加样品信息</text>
				</view>
				<view class="flex-sub ">
					<text class="cuIcon-right fr"></text>
				</view>
			</view>
		</view>
		
		
		<view class="padding-bottom-xs">
			<button class="button bt-sunway-blue" @tap="submit"><text class="text-white">下单</text></button>
		</view>
	</view>
</template>

<script>
	import md5 from '../../common/MD5.js'
	import loginjs from '../login/login.js'
	import { HTTP } from '../../common/http.js';
	export default {
		data () {
			return {
					
					//检测因子价格管理数据
					detectionFactionList : [],
					
					//检测类型数据
					monitorTmplIdList : ['0'],
					monitorTmplValueList : [''],
					monitorTmplSelectList : [],
					
					//委托单位相关参数
					entrustOrgName : getApp().globalData.userInfo.clientName,
					entrustOrgAddress : getApp().globalData.userInfo.address,
					entrustOrgContact : getApp().globalData.userInfo.lxrName,
					entrustOrgPhone : getApp().globalData.userInfo.phoneNumber,
					
					//受检单位相关参数
					testOrgName : getApp().globalData.userInfo.clientName,
					testOrgAddress : getApp().globalData.userInfo.address,
					testOrgContact : getApp().globalData.userInfo.lxrName,
					testOrgPhone : getApp().globalData.userInfo.phoneNumber,
					
					
					//点位数量
					folderNumber : 0,
					folderNumberList : [],
					//点位数据
					folderList : [],
					
					//样品数量
					orderNumber : 0,
					orderNumberList : [],
					//样品数据
					orderList : [],
					
					//列表长度参数
					selectStyleHeight : 900,
					
					isSample : true,
					notSample : false,
					
					checked : true,
					
					sameTpye : true,
					
					urgentType : false,
					urgentTypeIndex : 0,
					urgentTypeList: ['否', '加急', '特急'],
					
					billType : false,
					
					paperType : false,
					receiveAddress : '',
				// 滑动操作相关
					options:[
				        {
				            text: '删除',
				            style: {
				                backgroundColor: '#dd524d'
				            }
				        }
				      ]

			}
		},
		
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options){	
			var folderList = getApp().globalData.folderList;
			var orderList = getApp().globalData.orderList;
				console.log(folderList)
			console.log(orderList)
		
			if(folderList.length !== 0){
				this.folderList = folderList;
				this.folderNumber = folderList.length
				for(let i = 1; i <= this.folderNumber; i++) {
				  this.folderNumberList.push(i)
				}
			}
			if(orderList.length !== 0){
				this.orderList = orderList;
				this.orderNumber = orderList.length
				for(let i = 1; i <= this.orderNumber; i++) {
				  this.orderNumberList.push(i)
				}
			}
		
			wx.request({
				url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-detection-factor-price',
				method: getApp().globalData.method,
				success: (res) => {
					var detectionFactionList = res.data;
					this.detectionFactionList = JSON.stringify(detectionFactionList);
				},
			});
			wx.request({
				url: getApp().globalData.host + '/open/emc/module/bp/wechat/select-monitor-tmpl',
				method: getApp().globalData.method,
				success: (res) => {
					var list = res.data;
					var monitorTmplIdList = this.monitorTmplIdList;
					var monitorTmplValueList = this.monitorTmplValueList;
					var monitorTmplSelectList = this.monitorTmplSelectList
					for(let i = 0 ; i < list.length ; i++){
						var type = true;
						for(var j = 0 ; j < monitorTmplIdList.length ; j++){
							if(monitorTmplIdList[j] == list[i].id){//保证检测类型下拉框每一行数据都是不重复的
								type = false;
								break;
							}
						}
						if(type){
							monitorTmplIdList[monitorTmplIdList.length] = list[i].id;
							monitorTmplValueList[monitorTmplValueList.length] = list[i].monitorTmplName;
							monitorTmplSelectList[monitorTmplSelectList.length] = {
								text : list[i].monitorTmplName,
								value : list[i].id,
							}
						}
					}
					this.monitorTmplIdList = JSON.stringify(monitorTmplIdList);
					this.monitorTmplValueList = JSON.stringify(monitorTmplValueList);
					this.monitorTmplSelectList = JSON.stringify(monitorTmplSelectList);
				},
			});
			
		
			
			
			// 监听增加事件
			uni.$on('addFolder', this.addFolder)
			uni.$on('addOrder', this.addOrder)
			// 监听更新事件
			uni.$on('updateFolder', this.updateFolder)
			uni.$on('updateOrder', this.updateOrder)
		},
		onUnload() {
			uni.$off('addFolder');
			uni.$off('addOrder');
			uni.$off('updateFolder');
			uni.$off('updateOrder');
		},
		methods : {
			 swipeFolder(e, num){
				//点击选项按钮时触发事件	
				//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				if (e.index === 0) {
					// 删除
					this.delFolder(num)
				}
			},
			swipeOrder(e, num){
				//点击选项按钮时触发事件	
				//e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
				if (e.index === 0) {
					// 删除
					this.delOrder(num)
				}
			},
			swipeChange(e){
				//组件打开或关闭时触发	
				// left:左侧 ，right：右侧，none：关闭
			},
			//紧急程度点击下拉列表
			urgentTypeSelect(e) {
				this.urgentTypeIndex = e.target.value;
			},
			

			isUrgent : function(){
				this.urgentType = !this.urgentType;
			},
			needBill : function(){
				this.billType = !this.billType;
			},
			needPaper : function(){
				this.paperType = !this.paperType;
			},
			isSame : function(){
				this.sameTpye = !this.sameTpye;
			},
			
			addFolder : function(){
				this.folderNumber = this.folderNumber + 1;
				this.folderNumberList[this.folderNumberList.length] = this.folderNumberList.length + 1;
				this.folderList = getApp().globalData.folderList;
				// this.folderList[this.folderList.length] = {
				// 	detectionFactionId : '',
				// 	monitorTmplId : '',
				// 	testId : '',
				// 	methodId : '',
				// 	itemGroupId : '',
				// 	pointNumber : '',
				// 	pointName : '',
				// 	dayNumber : '',
				// 	frequency : '',
				// };
				// getApp().globalData.folderList = this.folderList;
			},
			delFolder : function(num)	 {
				this.folderNumber = this.folderNumber - 1;
				this.folderList = getApp().globalData.folderList;
				this.folderNumberList.splice(this.folderNumberList.length - 1,1)
				this.folderList.splice(num - 1,1)
				getApp().globalData.folderList = this.folderList;
			},
			updateFolder : function() {
				var folderList = getApp().globalData.folderList;
				for (var i = 0; i < folderList.length; i++) {
					this.$set(this.folderList,i,folderList[i])
				}
			},
			addOrder : function(){
				this.orderNumber = this.orderNumber + 1;
				this.orderNumberList[this.orderNumberList.length] = this.orderNumberList.length + 1;
				this.orderList = getApp().globalData.orderList;
				// this.orderList[this.orderList.length] = {
				// 	detectionFactionId : '',
				// 	monitorTmplId : '',
				// 	testId : '',
				// 	methodId : '',
				// 	itemGroupId : '',
				// 	sendDate : '',
				// 	sendTime : '',
				// 	sampleCompleteDate : '',
				// 	sampleCompleteTime : '',
				// };
				// getApp().globalData.orderList = this.orderList;
			},
			delOrder : function(num)	 {
				this.orderNumber = this.orderNumber - 1;
				this.orderList = getApp().globalData.orderList;
				this.orderNumberList.splice(this.orderNumberList.length - 1,1)
				this.orderList.splice(num - 1,1)
				getApp().globalData.orderList = this.orderList;
			},
			updateOrder : function() {
				var orderList = getApp().globalData.orderList;
				for (var i = 0; i < orderList.length; i++) {
					this.$set(this.orderList,i,orderList[i])
				}
			},
			changeSample : function(){
				this.checked = !this.checked;
				if(this.checked){
					this.isSample = true;
					this.notSample = false;
				}else{
					this.isSample = false;
					this.notSample = true;
				}
			},
			
			// 跳转函数
			Navigate: function (e) {
				var url = e.substring(0,e.indexOf(','));
				var number = e.substring(e.indexOf(',') + 1);
				var monitorTmplIdList = this.monitorTmplIdList;
				var monitorTmplValueList = this.monitorTmplValueList;
				var monitorTmplSelectList = this.monitorTmplSelectList;
				var detectionFactionList = this.detectionFactionList;
				console.log(this.monitorTmplSelectList)
				wx.navigateTo({
					url: `${url}?monitorTmplIdList=${monitorTmplIdList}&monitorTmplValueList=${monitorTmplValueList}&monitorTmplSelectList=${monitorTmplSelectList}&detectionFactionList=${detectionFactionList}&number=${number}`,
				});
			},
			
			setEntrustOrgName : function(e){
				this.entrustOrgName = e.target.value;
			},
			
			setEntrustOrgAddress : function(e){
				this.entrustOrgAddress = e.target.value;
			},
			
			setEntrustOrgContact : function(e){
				this.entrustOrgContact = e.target.value;
			},
			
			setEntrustOrgPhone : function(e){
				let value = e.target.value.replace(/\D/g, '');
				this.entrustOrgPhone = value;
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
				if (this.entrustOrgPhone.length == 0) {
					wx.showToast({
						title: '输入的手机号为空，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				} else if (this.entrustOrgPhone.length < 11) {
					wx.showToast({
						title: '手机号长度有误，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				} else if (!myreg.test(this.entrustOrgPhone)) {
					wx.showToast({
						title: '手机号有误，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				}
			},
			
			//受检单位相关数据赋值
			setTestOrgName : function(e){
			  this.testOrgName = e.target.value;
			},
			
			setTestOrgAddress : function(e){
			  this.testOrgAddress = e.target.value;
			},
			
			setTestOrgContact : function(e){
			  this.testOrgContact = e.target.value;
			},
			
			setTestOrgPhone : function(e){
				let value = e.target.value.replace(/\D/g, '');
				this.testOrgPhone = value;
				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
				if (this.testOrgPhone.length == 0) {
					wx.showToast({
						title: '输入的手机号为空，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				} else if (this.testOrgPhone.length < 11) {
					wx.showToast({
						title: '手机号长度有误，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				} else if (!myreg.test(this.testOrgPhone)) {
					wx.showToast({
						title: '手机号有误，请重新输入！',
						icon: 'none',
						duration: 1500
					});
				}
			},
			
			setReceiveAddress : function(e)	 {
				 this.receiveAddress = e.target.value;
			},
			submit : function(){
				var detectionFactionList = JSON.parse(this.detectionFactionList);
				var isSampleType = this.isSample;
				var folderList = getApp().globalData.folderList;
				var folderNumber = this.folderNumber;
				var orderList = getApp().globalData.orderList;
				var orderNumber = this.orderNumber;
				var entrustOrgName = this.entrustOrgName;
				var entrustOrgAddress = this.entrustOrgAddress;
				var entrustOrgContact = this.entrustOrgContact;
				var entrustOrgPhone = this.entrustOrgPhone;
				if (this.sameTpye) {
					var testOrgName = this.entrustOrgName;
					var testOrgAddress = this.entrustOrgAddress;
					var testOrgContact = this.entrustOrgContact;
					var testOrgPhone = this.entrustOrgPhone;
				} else {
					var testOrgName = this.testOrgName;
					var testOrgAddress = this.testOrgAddress;
					var testOrgContact = this.testOrgContact;
					var testOrgPhone = this.testOrgPhone;
				}
				var urgentType = this.urgentTypeList[this.urgentTypeIndex];
				// var urgentType = this.urgentType;
				var billType = this.billType;
				var paperType = this.paperType;
				var receiveAddress = this.receiveAddress;
				
				
				var returnDetectionFaction = [];
				var flag = false;
				if(entrustOrgName == undefined || entrustOrgAddress == undefined || entrustOrgContact == undefined || entrustOrgPhone == undefined
					|| testOrgName == undefined || testOrgAddress == undefined || testOrgContact == undefined ||testOrgPhone == undefined){
						flag = true;
				}
				if(flag){
					wx.showToast({
						title: '请完善信息',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				if(this.sameTpye && folderList.length == 0){
					wx.showToast({
						title: '请添加点位信息',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				if(!this.sameTpye && orderList.length == 0){
					wx.showToast({
						title: '请添加样品信息',
						icon: 'none',
						duration: 1500
					});
					return;
				}
				wx.showModal({
					title: '提示',
					content: '提交后信息无法修改，请再次确认是否提交',
					success (res) {
						
						
						if (res.confirm) {
							//价格参数
							var price = 0;
							var list = orderList;
							if(isSampleType){
								list = folderList;
							}
							//循环检索点位数据对应的价格因子数据
							for (var i = 0 ; i < detectionFactionList.length ; i++){
								for(var j = 0 ; j < list.length ; j ++){
									// if(detectionFactionList[i].ext$.monitortmplid.indexOf(list[j].monitorTmplId) > -1 
									// 	&& list[j].testId == detectionFactionList[i].testId 
									// 	&& list[j].methodId == detectionFactionList[i].methodId 
									// 	&& list[j].itemGroupId == detectionFactionList[i].itemGroupId){
									if( list[j].testItemIds.indexOf(detectionFactionList[i].ext$.id) > -1){
										returnDetectionFaction[returnDetectionFaction.length] = detectionFactionList[i];
										list[j].detectionFactionId = detectionFactionList[i].id;
										var samplePrice =detectionFactionList[i].samplePrice;
										var analysisPrice = detectionFactionList[i].analysisPrice;
										
										if(isSampleType){
											price = price*100/100 + (samplePrice*100/100 + analysisPrice*100/100) * list[j].dayNumber * list[j].frequency;
										} else {
											price = price*100/100 + analysisPrice*100/100;
										}
										if(urgentType == '加急') {
											price = price * 1.5
										} 
										
										if(urgentType == '特急') {
											price = price * 2
										} 
									}
								}
							}
		
							/*** 请求后台  服务端调用微信支付接口 ***/
							HTTP(`/open/emc/module/bp/wechat/create-PreOrder`,{
								appId: getApp().globalData.appId,
								openId: getApp().globalData.openId,
								clientContactId : getApp().globalData.userInfo.clientContactId,
								orderNo: (new Date().getTime()).toString(),
								desc: "委托监测",
								price: 1,
								urgentType : urgentType,
								billType: billType,
								paperType : paperType,
								receiveAddress : receiveAddress,
								isSampleType : isSampleType,
								orderList : orderList,
								folderList : folderList,
								entrustOrgName : entrustOrgName,
								entrustOrgAddress : entrustOrgAddress,
								entrustOrgContact : entrustOrgContact,
								entrustOrgPhone : entrustOrgPhone,
								testOrgName : testOrgName,
								testOrgAddress : testOrgAddress,
								testOrgContact : testOrgContact,
								testOrgPhone : testOrgPhone,
								notifyServer : 'http://cn-qz-plc-1.ofalias.net:55134/',
								// notifyServer : getApp().globalData.host //回调服务地址
							}).then(res=>{
								if (res.data.valid == 'false') {
									wx.showToast({
										title: res.data.message,
										icon: 'none',
										duration: 2000
									});
								}
								// todo  
								//生成一个未支付的预订单   
								//将预订单生成一个预览页面展示， 
								//用户选择支付方式及填写备注后支付 
																	
								// 获取订单id
								var wxOrderId = res.data.id
								wx.requestPayment({
									appId: getApp().globalData.appId,
									timeStamp: res.data.timestamp,
									nonceStr: res.data.nonceStr,
									package: res.data.package,
									signType: res.data.signType,
									paySign: res.data.paySign,
									success : function (res) {
										// 付款成功后数据传回后台生成合同以及任务
										HTTP(`/open/emc/module/bp/wechat/create-data`,{
											wxOrderId : wxOrderId,
											folderList : folderList,
											folderNumber : folderNumber,
											orderList : orderList,
											orderNumber : orderNumber,
											isSampleType : isSampleType,
											entrustOrgName : entrustOrgName,
											entrustOrgAddress : entrustOrgAddress,
											entrustOrgContact : entrustOrgContact,
											entrustOrgPhone : entrustOrgPhone,
											testOrgName : testOrgName,
											testOrgAddress : testOrgAddress,
											testOrgContact : testOrgContact,
											testOrgPhone : testOrgPhone,
											price : price,
										}).then(res=>{
											// 清空点位和样品缓存
											getApp().globalData.folderList = []
											getApp().globalData.orderList = []
											wx.requestSubscribeMessage({
											  tmplIds: ['grgzgyHgYR471-5j_59Y6wVMNIZhNjYLu99eXWOUwD0'],
											  success (res) {
											  }
											})
											uni.redirectTo({
												url: `../orderdetail/orderdetail?wxOrderId=${wxOrderId}` ,
											})
											uni.showToast({
												title: '支付成功',
												icon: 'none',
												duration: 2000
											});
											loginjs.methods.selectRedDotCue(); // 支付订单后 更新订单待评价数量
										}).catch(err=>{
											wx.showToast({
												title: '任务生成失败，请联系管理员',
												icon: 'none',
												duration: 2000
											});
										});
									},
									fail : function (res) {
										if (res.errMsg === 'requestPayment:fail cancel') {
											wx.showToast({
												title: '用户取消支付',
												icon: 'none',
												duration: 2000
											});
										} else {
											wx.showToast({
												title: res.errMsg,
												icon: 'none',
												duration: 2000
											});
										}
										uni.redirectTo({
											url: `../orderdetail/orderdetail?wxOrderId=${wxOrderId}` ,
										})
									},
								});
							}).catch(err=>{
								wx.showToast({
									title: '请求微信支付接口出错，请联系管理员',
									icon: 'none',
									duration: 2000
								});
							});
						}
					}
				});
			},
		},
	}
</script>
	
<style scoped>
	@import url(../placeorder/placeorder.css);
	@import url(../../common/uni-nvue.css);
	@import url(../../common/uni.css);
</style>