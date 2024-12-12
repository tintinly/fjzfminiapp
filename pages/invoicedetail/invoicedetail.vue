<template>
	<view>
		<!-- 这里是固定的导航栏 -->
		<view class="nav-bar-top" :style="'height:' + navHeight + 'px;' + 'border-width : ' + navBorder +'px;' ">
			<view class="nav-bar" :style="'top:' + statusbarHeight + 'px;' + 'height:' + nav + 'px'" >
				<view class="back-button"  @click="back">
					<uni-icons   custom-prefix="iconfont" type="icon-31fanhui1" size="20" color="white" ></uni-icons>
				</view>
				<view class="nav-title" >
					<text class="text-xl text-white">发票详情</text>
				</view>
			</view>
		</view>
		
		<!-- 中心内容 -->
		<view class="content-center" :style="'margin-top : ' + (navHeight + navBorder * 2) + 'px;'">
			<!-- 状态 -->
			<view class="padding  " >
				<view > <text class="text-lg ">开票成功</text></view>
				<view > <text class="text-sm ">感谢您的信任</text></view>
			</view>
			
			<view class="bg-white margin-lr radius ">
				<view class="padding" >
					<view class="">发票金额 ：￥1600</view>
					<view class="flex margin-top-sm">
						<view class="flex-treble">一张发票，含1笔订单</view>
						<view class="flex-sub" v-if="wxOrderId">
							<view class="fr"  @click="toPage('../orderdetail/orderdetail?wxOrderId=' + wxOrderId)">
								<text class="text-blue">查看订单</text><uni-icons custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons>
							</view>
						</view>
					</view>
			
				</view>
			</view>
			
			<!-- <view class="bg-white margin-top margin-lr radius"  >
				<view class="padding-lr">
					<view class="solid-bottom padding-tb"  >
						<view class=""><text class="cuIcon-form  text-sunway-blue"></text>发票信息</view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="fl">发票号</view></view>
						<view class="flex-sub fr"><view class="fr">49554496</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="fl">企业地址</view></view>
						<view class="flex-sub fr"><view class="fr">江阴经济开发区滨江东路297号</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="fl">企业电话</view></view>
						<view class="flex-sub fr"><view class="fr">0510-80676956</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="fl">开户银行</view></view>
						<view class="flex-sub fr"><view class="fr">浦发江阴朝阳路支行</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="fl">开户行账号</view></view>
						<view class="flex-sub fr"><view class="fr">8534080202828</view></view>
					</view>
				</view>
			</view> -->
			
			<view class="bg-white margin-top margin-lr radius"  >
				<view class="padding-lr">
					<view class="solid-bottom padding-tb"  >
						<view class=""><text class="cuIcon-form  text-sunway-blue"></text> <text class="text-bold">发票信息</text></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="text-grey fl">发票号</view></view>
						<view class="flex-treble fr"><view class="fr">{{invoice.invoiceNo}}</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="text-grey fl">企业地址</view></view>
						<view class="flex-treble fr"><view class="fr">{{invoice.ext$.address}}</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="text-grey fl">企业电话</view></view>
						<view class="flex-treble fr"><view class="fr">{{invoice.ext$.phone}}</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="text-grey fl">开户银行</view></view>
						<view class="flex-treble fr"><view class="fr">{{invoice.ext$.openingbank}}</view></view>
					</view>
					<view class="flex dashed-bottom padding-tb-sm"  >
						<view class="flex-sub "><view class="text-grey fl">开户行账号</view></view>
						<view class="flex-treble fr"><view class="fr">{{invoice.ext$.bankaccount}}</view></view>
					</view>
				</view>
			</view>
			
			
			<!-- 底部按钮栏 -->
			<view class="margin-top" :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  "></view>
			<view class="btn-group-bottom" :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
				<button  class="button bg-sunway-blue" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="viewInvoicePic(invoice.ext$.invoicepic)">查看发票</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//导航栏相关
				navBorder : 2,
				nav : getApp().globalData.nav,
				navHeight	 : getApp().globalData.navHeight,
				statusbarHeight : getApp().globalData.navHeight - getApp().globalData.nav,
				// 底部相关
				unSafeButtomHeight : getApp().globalData.unSafeButtomHeight,
				btnHeight : 45,
				btnMargin : 10,
				
				invoiceId : '',
				invoice : {},
				contract : {},
				wxOrderId : '',
			}
		},
		onLoad(e) {
			this.invoiceId = e.invoiceId
			this.selectInvoiceDetail(e.invoiceId)
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
			selectInvoiceDetail: function(invoiceId) {
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-invoice-detail',
					data : {
						invoiceId : invoiceId,
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						var invoice = res.data.invoice;
						this.invoice = invoice;
						var contract = res.data.contract;
						this.contract = contract;
						var wxOrders = res.data.wxOrders;
						if (wxOrders != undefined && wxOrders.length > 0) {
							this.wxOrderId = wxOrders[0].id;
						}
					
						uni.hideLoading()
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
			viewInvoicePic : function(downloadUrl){
				var _this = this;
				if (downloadUrl == undefined || downloadUrl == '') {
					wx.showToast({
						title: '暂无发票图片',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.downloadFile({
					url: getApp().globalData.host  + downloadUrl,
					success: function (res) {
						console.log('downloadFile', res);
						const filePath = res.tempFilePath
						if (_this.isImg(filePath)) {
							wx.previewImage({
								urls : [filePath],
								current : filePath,
								fail: function (res) {
									wx.showToast({
										title: '发票图片已失效',
										icon: 'none',
										duration: 2000
									});
								},
							})
						} else if (_this.isDocument(filePath)) {
							wx.openDocument({
								filePath: filePath,
								showMenu:true, 
								success: function (res) {
									wx.hideLoading()
								},
								fail: function (res) { 
									wx.showToast({
										title: '发票pdf已失效',
										icon: 'none',
										duration: 2000
									});
							  },
							})
						} else {
							wx.showToast({
								title: '发票文件类型不支持查看',
								icon: 'none',
								duration: 2000
							});
						}
						
					},
					fail: function (res) {
						wx.showToast({
							title: '发票图片已失效',
							icon: 'none',
							duration: 2000
						});
					},
				});
			},
			isImg(url) {
			  var index = url.lastIndexOf(".")
			  var ext = url.substring(index + 1)
			  return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1
			},
			isDocument(url) {
			  var index = url.lastIndexOf(".")
			  var ext = url.substring(index + 1) 
			  return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].indexOf(ext.toLowerCase()) !== -1
			}
		}
	}
</script>

<style>

	.nav-bar-top {
		z-index: 1;
		width: 100%;
		position:fixed;
		background-color: #3881ed;
		border-style :solid ;
		border-color: #3881ed;
		top : 0px  /* 使fixed位置生效 */
	}
	
	.nav-bar {
		width: 100%;
		position:fixed;
		display: flex;
		flex-direction: row;
		align-items: center;
		/* border: 2px solid; */
	}
	
	.nav-title {
			position:absolute;
			left: 50%;    /* 起始是在body中，横向距左50%的位置 */
			transform:translate(-50%); /* 水平、垂直都居中,也可以写成下面的方式 */
			text-align: center;
	}
	
	
	.back-button {
		position:absolute;
		left: 1%;    
	}
	
	.radius {
		border-radius: 16rpx;
	}
	
	.btn-group-bottom {
		z-index: 1;
		width: 100%;
		position: fixed;
		bottom : 0px;
		background-color: #ffffff;
		box-shadow: -20px 0px 5px rgba(39, 48, 57, 0.05);
	}
	
	.button{
		border-radius: 80rpx;
		/* margin: 20rpx 20rpx; */
		/* font-size: 35rpx; */
		/* background-color: cornflowerblue; */
	}
</style>
