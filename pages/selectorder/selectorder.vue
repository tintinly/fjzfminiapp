<template>
    <view>
		<view v-if="warning" class="topTip">
			<text class="cuIcon-warn text-yellow margin-right-sm"></text><text class="">未找到所属企业，请前往<text class="text-blue" @click="toPage('../mydetail/mydetail', true)">个人信息</text>中维护</text>
		</view>
			
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
	import { HTTP } from '../../common/http.js';
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
				toCommentSize : 0,
				clientContactId : getApp().globalData.userInfo.clientContactId, 
			}
		},
		computed : {
			warning(e) {
				return this.clientContactId == undefined || this.clientContactId == '';
			},
		},
		onLoad(e) {
			var that = this
			console.log(e);
			if (this.tabIndexList.indexOf(Number(e.tabIndex)) > -1) {
				this.tabIndex = e.tabIndex;
			}
			this.selectOrder(this.tabIndex)
			uni.$on('refreshOrder',function(callback) {
				that.selectOrder(that.tabIndex, callback)
			})
			uni.$on('updateUserInfo',function(callback) {
				that.clientContactId = e.clientContactId
				if (that.clientContactId != undefined && that.clientContactId != '') {
					that.selectOrder(that.tabIndex, callback);
				}
			});
		},
		onUnload() {
			uni.$off('refreshOrder');
			uni.$off('updateUserInfo');
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
				HTTP(`/open/emc/module/bp/wechat/select-wx-order`,{
					clientContactId : getApp().globalData.userInfo.clientContactId,
					openId : getApp().globalData.openId,
					tradeState : tradeState,
					comment : comment,
				}).then(res=>{
					this.wxOrderList = res.data.wxOrderList
					this.toCommentSize = res.data.toCommentSize
					if (callback != undefined) {
						callback(this.toCommentSize)
					}
					getApp().globalData.toCommentSize = res.data.toCommentSize
					this.noData = this.wxOrderList.length == 0
				}).catch(err=>{
					this.wxOrderList = []
					this.toCommentSize = []
					this.noData = true
				});
			}
		}
	}
</script>

<style>
	@import url(../selectorder/selectorder.css);
</style>