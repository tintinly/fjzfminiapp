<template>
	<view>
		<view v-if="warning" class="topTip">
			<text class="cuIcon-warn text-yellow margin-right-sm"></text><text class="">未找到所属企业，请前往<text class="text-blue" @click="toPage('../mydetail/mydetail', true)">个人信息</text>中维护</text>
		</view>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
<!-- 		<view class="bg-white margin-top margin-lr radius ">
			<view class="flex padding align-center" >
				<view class="flex-treble">
					<view class="">发票类型 ：增值税专用发票</view>
					<view class="margin-top-sm ">开票金额 ：1600元</view>
					<view class="margin-top-sm ">填开日期 ：2024-01-10</view>
				</view>
				<view class="flex-sub ">
					<view>开票成功<uni-icons custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons></view>
				</view>
			</view>
		</view> -->
		
		
		<view class="bg-white margin-top margin-lr radius " v-for="item in invoiceList"  @tap="toPage('../invoicedetail/invoicedetail?invoiceId=' + item.invoiceId)">
			<view class="flex padding align-center" >
				<view class="flex-treble">
					<view class="">发票类型 ：{{item.invoiceCategory}}</view>
					<view class="margin-top-sm ">开票金额 ：{{item.invoiceAmount}}元</view>
					<view class="margin-top-sm ">填开日期 ：{{item.invoiceFilledDate}}</view>
				</view>
				<view class="flex-sub ">
					<view>开票成功<uni-icons custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons></view>
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
				invoiceList : [],
				noData : true,
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
				}
			})
			this.loadData();
		},
		onUnload() {
			uni.$off('updateUserInfo');
		},
		methods: {
			// 跳转函数
			toPage: function (url) {
				uni.navigateTo({
					url: url
				})
			},
			loadData : function() {
				HTTP(`/open/emc/module/bp/wechat/select-invoice`,{
					clientNo : getApp().globalData.userInfo.clientNo
				}).then(res=>{
					var data = res.data;
					var invoiceList = [];
					for(var i = 0 ; i < data.length ; i++){
						invoiceList[invoiceList.length] = {
							invoiceId : data[i].invoiceId ,
							invoiceCategory : data[i].invoiceCategory ? data[i].invoiceCategory : '',
							invoiceAmount : data[i].invoiceAmount ? data[i].invoiceAmount : '',
							invoiceFilledDate : data[i].invoiceFilledDate ? data[i].invoiceFilledDate : '',
						}
					}
					this.invoiceList = invoiceList;
					this.noData = this.invoiceList.length == 0
				}).catch(err=>{
					this.invoiceList = [];
					this.noData = true
				});
			}
		}
	}
</script>

<style>
	@import url(../selectinvoice/selectinvoice.css);
</style>
