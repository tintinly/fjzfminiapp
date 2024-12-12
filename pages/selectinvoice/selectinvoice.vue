<template>
	<view>
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
	export default {
		data() {
			return {
				invoiceList : [],
				noData : true
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
				url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-invoice',
				data : {
					clientNo : options.clientNo
				},
				method : getApp().globalData.method,
				success : (res) => {
					if(res.statusCode != 200){
						this.invoiceList = []
						this.noData = true
						wx.showToast({
							title: '网络错误',
							icon: 'none',
							duration: 1500
						});
					}else if(res.data.length == 0){
						this.invoiceList = []
						this.noData = true
						wx.showToast({
							title: '未查到相关信息',
							icon: 'none',
							duration: 1500
						});
					}else{
						var data = res.data;
						console.log('data',data)
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
		methods: {
			// 跳转函数
			toPage: function (url) {
				uni.navigateTo({
					url: url
				})
			},
		}
	}
</script>

<style>
	@import url(../selectinvoice/selectinvoice.css);
</style>
