<template>
	<view>

		<!-- 这里是固定的导航栏 -->
		<view class="nav-bar-top" :style="'height:' + navHeight + 'px;' + 'border-width : ' + navBorder +'px;' ">
			<view class="nav-bar" :style="'top:' + statusbarHeight + 'px;' + 'height:' + nav + 'px'" >
				<view class="back-button"  @click="back">
					<uni-icons   custom-prefix="iconfont" type="icon-31fanhui1" size="20" color="white" ></uni-icons>
				</view>
				<view class="nav-title" >
					<text class="text-xl text-white">订单详情</text>
				</view>
			</view>
		</view>
		
		
		<!-- 中心内容 -->
		<view class="content-center" :style="'margin-top : ' + (navHeight + navBorder * 2) + 'px;'">
			<!-- 订单状态 -->
			<view class="order-status" v-if="order.tradeState === 'NOTPAY'">
				<view > <text class="text-xl ">待支付</text></view>
				<view > <text class="text-sm ">剩余支付时间（超时自动关闭）</text></view>
				<view class="text-orange text-df"> <text class="cuIcon-time"></text><text >{{min}}分钟 {{sec}}秒 </text></view>
			</view>
			<view class="order-status" v-else-if="order.tradeState === 'SUCCESS'">
				<view > <text class="text-xl ">已完成</text></view>
				<view > <text class="text-sm ">感谢您的信任，欢迎再来</text></view>
			</view>
			<view class="order-status" v-else-if="order.tradeState === 'CLOSED'">
				<view > <text class="text-xl ">已取消</text></view>
				<view v-if="order.expired == '1'"> <text class="text-sm ">超时未支付，自动取消。</text></view>
				<view v-else> <text class="text-sm ">您已手动取消订单</text></view>
			</view>
			
			
			<!-- 点位信息 -->
			<view class="content-box" v-if="order.isSampleType == '1'">
				<!-- <view class="content-title solid-bottom" @tap="viewReport(item.projId)" > -->
				<view class="content-title "  >
					<view><text class="text-lg text-bold">点位信息</text></view>
				</view>
				<view  v-for="(item, index) in orderDetailList">
					<view class="content-row dashed-bottom" @click="expendPoint(item)">
						<view class="content-num-before">
							<view class="content-num "><view style="padding-top: 2.5px;">{{index + 1}}</view></view>
						</view>
						<!-- <view class="folder-order-info"> -->
							<view class="mainInfo">
								<text class="text-bold ">
									{{item.pointNumber}}&nbsp;&nbsp;{{item.pointName}}&nbsp;&nbsp;{{item.dayNumber}}天&nbsp;&nbsp;{{item.frequency}}次
								</text>
							</view>
						
						<!-- </view> -->
						<view  class="content-right " >
							<text class=" text-price text-sm padding-right-xs">{{item.price}}</text>
							<uni-icons v-show="!item.showChildren" custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons>
							<uni-icons v-show="item.showChildren" custom-prefix="iconfont" type="icon-xiangxiajiantou" size="10px"></uni-icons>
						</view>
					</view>
					
					<view v-show="item.showChildren">
						<view class="content-row dashed-bottom" v-for="(item, index) in item.children">
							<!-- <view class="folder-order-info"> -->
								<view class="extInfo">
									<text class="text-grey text-df">
										{{item.testValue}}&nbsp;&nbsp;{{item.methodValue}}&nbsp;&nbsp;{{item.itemGroupValue}}
									</text>
								</view>
							
							<!-- </view> -->
							<view  class="content-right " >
								<text class=" text-price text-sm ">{{item.price}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="content-sum">
					<view >
						<text class="text-sm">总计：</text><text class="text-price text-lg text-bold ">{{order.total}}</text>
					</view>
				</view>
			</view>
			
			<!-- 样品信息 -->
			<view class="content-box" v-else-if="order.isSampleType != '1'">
				<!-- <view class="content-title solid-bottom" @tap="viewReport(item.projId)" > -->
				
				<view class="content-title ">
					<view><text class="text-lg text-bold">样品信息</text></view>
				</view>
				<view v-for="(item, index) in orderDetailList">
					<view class="content-row dashed-bottom" @click="expendPoint(item)">
						<view class="content-num-before">
							<view class="content-num "><view style="padding-top: 2.5px;">{{index + 1}}</view></view>
						</view>
						<!-- <view class="folder-order-info"> -->
							<view class="mainInfo">
								<text class="text-bold ">
									送样日期：{{item.sendDate}}&nbsp;&nbsp;采样完成日期{{item.sampleCompleteDate}}
								</text>
							</view>
						<!-- </view> -->
						<view  class="content-right " >
							<text class=" text-price text-sm padding-right-xs"> {{item.price}}</text>
							<uni-icons v-show="!item.showChildren" custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons>
							<uni-icons v-show="item.showChildren" custom-prefix="iconfont" type="icon-xiangxiajiantou" size="10px"></uni-icons>
						</view>
					</view>
					<view v-show="item.showChildren">
						<view class="content-row dashed-bottom" v-for="(item, index) in item.children">
							<!-- <view class="folder-order-info"> -->
								<view class="extInfo">
									<text class="text-grey text-df">
										{{item.testValue}}&nbsp;&nbsp;{{item.methodValue}}&nbsp;&nbsp;{{item.itemGroupValue}}
									</text>
								</view>
							<!-- </view> -->
							<view  class="content-right " >
								<text class=" text-price text-sm ">{{item.price}}</text>
							</view>
						</view>
					</view>
				</view>
				
				<view class="content-sum">
					<view>
						<text class="text-sm">总计：</text><text class="text-price text-lg text-bold "> {{order.total}}</text>
					</view>
				</view>
			</view>
			
			
			
			<!-- 发票信息 -->
			<view class="content-box" v-if="bill === undefined">
				<!-- <view class="content-title solid-bottom" @tap="viewReport(item.projId)" > -->
				<view class="content-title "  v-if="order.tradeState === 'NOTPAY'">
					<view><text class="text-lg text-bold">发票信息</text></view>
					<view><text class="text-sm"> 订单完成后可开具电子发票</text></view>
				</view>
				<view class="content-title "  v-else-if="order.tradeState === 'SUCCESS'">
					<view><text class="text-lg text-bold">发票信息</text></view>
					<view @tap="toPage('../todo/todo')"><text class="text-sm padding-right-xs"> 开具电子发票</text><uni-icons custom-prefix="iconfont" type="icon-xiangyoujiantou" size="10px"></uni-icons></view>
				</view>
				<view class="content-title "  v-else-if="order.tradeState === 'CLOSED'">
					<view><text class="text-lg text-bold">发票信息</text></view>
					<view><text class="text-sm"> 订单已取消，不可开票</text></view>
				</view>
			</view>
			<view class="content-box" v-else>
				<view >
					<view class="content-title "  >
						<view><text class="text-lg text-bold">发票信息</text></view>
					</view>
					<view class="content-row dashed-bottom"  >
						<view><text class="text-lg text-grey">发票类型</text></view>
						<view><text class="text-lg ">企业单位</text></view>
					</view>
					<view class="content-row "  >
						<view><text class="text-lg text-grey">发票内容</text></view>
						<view @tap="toPage('../todo/todo')"><text class="text-lg padding-right-xs">查看发票</text><uni-icons custom-prefix="iconfont" type="icon-xiangyoujiantou" size="12px"></uni-icons></view>
					</view>
				</view>
			</view>
			
			
			<!-- 订单信息 -->
			<view class="content-box" >
				<!-- <view class="content-title solid-bottom" @tap="viewReport(item.projId)" > -->
				
				<view class="content-title "  >
					<view><text class="text-lg text-bold">订单信息</text></view>
					
				</view>
				<view class="content-row dashed-bottom"  >
					<view><text class="text-lg text-grey">订单号</text></view>
					<view><text class="text-lg ">{{order.outTradeNo}}</text></view>
				</view>
				<view class="content-row dashed-bottom"  v-if="order.tradeState === 'SUCCESS'">
					<view><text class="text-lg text-grey">交易号</text></view>
					<view><text class="text-lg ">{{order.transactionId}}</text></view>
				</view>
				<view class="content-row dashed-bottom"  >
					<view><text class="text-lg text-grey">下单时间</text></view>
					<view><text class="text-lg ">{{order.createdTime}}</text></view>
				</view>
				<view class="content-row dashed-bottom"  v-if="order.tradeState === 'SUCCESS'">
					<view><text class="text-lg text-grey">支付时间</text></view>
					<view><text class="text-lg ">{{order.payTime}}</text></view>
				</view>
				<view class="content-row dashed-bottom"  v-if="order.paperType === '1'">
					<view><text class="text-lg text-grey" >收货地址</text></view>
					<view><text class="text-lg ">{{order.receiveAddress}}</text></view>
				</view>
				<view class="content-row dashed-bottom"  >
					<view><text class="text-lg text-grey">紧急程度</text></view>
					<view><text class="text-lg ">{{order.urgentType}}</text></view>
				</view>
<!-- 				<view class="content-row dashed-bottom"  >
					<view><text class="text-lg text-grey">是否加急</text></view>
					<view><text class="text-lg ">{{order.urgentType ? '是': '否' }}</text></view>
				</view> -->
				<view class="content-row "  >
					<view><text class="text-lg text-grey">备注</text></view>
					<view><text class="text-lg ">{{order.remark}}</text></view>
				</view>
			</view>
			
		</view>
		
		<!-- 底部按钮栏 -->
		<view class="margin-top" :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  "></view>
		<view class="btn-group-bottom " :style="'height:' + (unSafeButtomHeight + btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
			<view class="flex justify-end" :style="'height:' + (btnHeight * 1 + btnMargin * 2 * 1) + 'px;'  ">
				<button class="button bg-sunway-blue text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="pay" v-if="order.tradeState === 'NOTPAY'"  >立即支付</button>
				<button class="button  bg-sunway-blue text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="cancelWxOrder" v-if="order.tradeState === 'NOTPAY'" >取消订单</button>
				<button class="button  bg-yellow text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " @click="commentWxOrder" v-if="order.tradeState === 'SUCCESS'">评价</button>
				<button class="button bg-green text-white" :style="'line-height:' + btnHeight + 'px; margin : ' + btnMargin + 'px ;' " open-type='contact'>联系客服</button>
			</view>
		</view>
		<!-- 底部按钮栏 -->
	<!-- 	<view :style=" 'height : ' + (unSafeButtomHeight + btnGroupHeight) + 'px;'">
			<view class="btn-group-bottom" :style="'height:' + (unSafeButtomHeight + btnGroupHeight) + 'px;'  ">
				<view class="btn-group" :style="'bottom :' + unSafeButtomHeight + 'px;' + 'height : ' + btnGroupHeight + 'px;' ">
					<view class="margin-right-sm text-center"  v-if="order.tradeState === 'NOTPAY'">
						<button class="cu-btn sm round lines-blue" @click="pay">立即支付</button>
					</view>
					<view class="margin-right-sm text-center"  v-if="order.tradeState === 'NOTPAY'">
						<button class="cu-btn sm round lines-blue" @click="cancelWxOrder">取消订单</button>
					</view> -->
					<!-- <view class="margin-right-sm text-center" v-if="order.tradeState === 'SUCCESS' && order.comment === '0' " > -->
				<!-- 	<view class="margin-right-sm text-center" v-if="order.tradeState === 'SUCCESS' " >
						<button class="cu-btn sm round lines-yellow" @click="commentWxOrder">评&nbsp;&nbsp;&nbsp;&nbsp;价</button>
					</view>
					<view class="margin-right-sm text-center"  >
						<button class="cu-btn sm round lines-blue" open-type='contact'>联系客服</button>
					</view>
				</view>
			</view>
		</view> -->
		
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
				btnHeight : 40,
				btnMargin : 10,
				
				// 订单相关
				wxOrderId : '',
				tradeStateList : ['CLOSED','NOTPAY','SUCCESS','REFUND','HISTORY'],
				tradeStateNameList : ['已取消','待支付','支付成功','已退款','历史订单'],
				order : {},
				orderDetailList : [],
				bill : undefined,//发票
				// 倒计时相关
				timer : undefined,
				min : '0',
				sec : '0'
			}
		},
		onLoad(e) {
			this.wxOrderId = e.wxOrderId
			this.selectOrderDetail(e.wxOrderId)
		},
		onUnload() {
			if(this.timer) {  
				clearTimeout(this.timer);  
				this.timer = undefined;  
			}  
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
			expendPoint(item) {
				// 如果无子选项不展开
				if(!item?.children?.length) {
					return ;
				};
				item.showChildren = !item.showChildren;
			},
			selectOrderDetail: function(wxOrderId) {
				uni.showLoading({
					title: '查询中...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-wx-order-detail',
					data : {
						wxOrderId : wxOrderId,
					},
					method : getApp().globalData.method,
					success : (res) => {
						console.log(res)
						var orderDetailList = res.data.orderDetailList
						var pointDetailList = orderDetailList.filter(f=>f.parentId == undefined);
						var testDetailList = orderDetailList.filter(f=>f.parentId != undefined);
						for (var i = 0; i < pointDetailList.length; i++) {
							pointDetailList[i].children = [];
							pointDetailList[i].showChildren = false;
							for (var j = 0; j < testDetailList.length; j++) {
								if (pointDetailList[i].id == testDetailList[j].parentId) {
									pointDetailList[i].children.push(testDetailList[j]);
								}
							}
						}
						this.orderDetailList = pointDetailList;
						console.log(this.orderDetailList);
						this.order = res.data.order;
						var order = this.order;
						if (pointDetailList !== undefined) {
							order.total = 0
							for (var i = 0; i < pointDetailList.length; i++) {
								console.log(pointDetailList[i])
								if (order.isSampleType == '1') {
									order.total = order.total + (pointDetailList[i].price - 0) *pointDetailList[i].dayNumber* pointDetailList[i].frequency
								} else {
									order.total = order.total + (pointDetailList[i].price - 0) 
								}
							} 
						}
						if(order.tradeState== 'NOTPAY') {
							this.countDown()
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
			countDown : function() {
				const end = Date.parse(new Date(this.order.timeExpire))
				const now = Date.parse(new Date())
				const msec = end - now
				console.log('计时器工作中')
				if(msec<0) {
						this.orderExpired()
						return
				};
		
				let day = parseInt(msec / 1000 / 60 / 60 / 24)
				let hr = parseInt(msec / 1000 / 60 / 60 % 24)
				let min = parseInt(msec / 1000 / 60 % 60)
				let sec = parseInt(msec / 1000 % 60)
				this.day = day
				this.hr = hr > 9 ? hr : '0' + hr
				this.min = min > 9 ? min : '0' + min
				this.sec = sec > 9 ? sec : '0' + sec
				const that = this
				if(min>=0 && sec>=0){
					//倒计时结束关闭订单
					if(min==0 && sec==0){
						this.orderExpired()
						return
					}
				this.timer = setTimeout(function () {
					that.countDown()
					}, 1000)
				}
			},
			orderExpired : function() {
				uni.showLoading({
					title: '请等待...',
				})
				uni.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/cancel-wx-order',
					data : {
						wxOrderId : this.wxOrderId,
						expired : '1'
					},
					method : getApp().globalData.method,
					success : (res) => {
						uni.hideLoading()
						uni.$emit('refreshOrder', {})
						uni.navigateBack({
							delta: 1
						});
						uni.showToast({
							title: '订单已超时',
							icon : 'none',
							duration: 1500
						})
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
			pay : function() {
		
				wx.requestPayment({
					"appId": getApp().globalData.appId,
					"timeStamp": this.order.ext$.timestamp,
					"nonceStr": this.order.ext$.noncestr,
					"package": this.order.ext$.package,
					"signType": this.order.ext$.signtype,
					"paySign": this.order.ext$.paysign,
					"success" : (res)=> {
						uni.showLoading({
							title: '支付中...',
						})
						console.log('支付情况',res)
						// 付款成功后数据传回后台生成合同以及任务
						wx.request({
							url: getApp().globalData.host + '/open/emc/module/bp/wechat/create-data',
							data : {
								wxOrderId : this.wxOrderId,
								folderList : this.orderDetailList,
								folderNumber : this.orderDetailList.length,
								orderList : this.orderDetailList,
								orderNumber : this.orderDetailList.length,
								isSampleType : this.order.isSampleType,
								entrustOrgName : this.order.entrustOrgName,
								entrustOrgAddress : this.order.entrustOrgAddress,
								entrustOrgContact : this.order.entrustOrgContact,
								entrustOrgPhone : this.order.entrustOrgPhone,
								testOrgName : this.order.testOrgName,
								testOrgAddress : this.order.testOrgAddress,
								testOrgContact : this.order.testOrgContact,
								testOrgPhone : this.order.testOrgPhone,
								price : this.order.total
							},
							method: 'POST',
							success: (res) => {
								setTimeout(() => {
									uni.hideLoading()
									uni.showToast({
										title: '支付成功',
										icon: 'none',
										duration: 2000
									});
									uni.redirectTo({
									    url: '../orderdetail/orderdetail?wxOrderId=' + this.wxOrderId 
									})
									uni.$emit('refreshOrder', {})
								}, 1000)
								
							
							},
						});
					},
					"fail" : (res) => {
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
					},
				});
			},
			cancelWxOrder : function() {
				uni.showModal({
					title: '提示',
					content: '确认取消该订单',
					success: (res)=> {
						if (res.confirm) {
							uni.showLoading({
								title: '请等待...',
							})
							uni.request({
								url : getApp().globalData.host + '/open/emc/module/bp/wechat/cancel-wx-order',
								data : {
									wxOrderId : this.wxOrderId,
									expired : '0'
								},
								method : getApp().globalData.method,
								success : (res) => {
									uni.hideLoading()
									uni.$emit('refreshOrder',{})
									uni.navigateBack({
										delta: 1
									});
									uni.showToast({
										title: '订单已取消',
										icon : 'none',
										duration: 1500
									})
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
						
						} 
					}
				});
			
			},
			commentWxOrder : function() {
				uni.navigateTo({
					url : '../ordercomment/ordercomment' + '?wxOrderId=' + this.wxOrderId
				})
			},
		}
	}
</script>

<style>
	.bg-box {
	    width: 100%;
	    height: 400rpx;
		position: fixed;
	    z-index: 0;
		  overflow: hidden;
		/* background-image: url(/static/image/top1.jpg); */
		/* -moz-background-size:100% 100%; background-size:100% 100%; */
		
		background: #3881ed;
	}

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
	
	.content-center{
	}
	
	.order-status {
		padding: 2px 27rpx;
		/* background-color: #3881ed; */
	}

	.content-box {
		margin: 15rpx 27rpx;
		border-radius: 16rpx;
		background-color: #ffffff;
		box-shadow: 10px 10px 5px rgba(39, 48, 57, 0.05);
	}
	
	

	
	.content-row {
		display: flex;
		padding: 2px 20px;
		position: relative;
		align-items: center;
		/* border-radius: 16rpx; */
		min-height: 70upx;
		justify-content: space-between;
		/* border-bottom: 1upx dashed rgba(0, 0, 0, 0.1); */
	}
	
	.content-sum {
		display: flex;
		flex-direction: row-reverse;
		padding: 5px 20px;
		align-items: center;
		/* border-radius: 16rpx; */
		min-height: 70upx;
		justify-content: space-between; 
	}
	
	.content-title {
		display: flex;
		padding: 5px 20px;
		align-items: center;
		/* border-radius: 16rpx; */
		min-height: 70upx;
		justify-content: space-between; 
		border-bottom: 1upx solid rgba(0, 0, 0, 0.1);
	}


	
	.content-num {
		width: 30px;
		height: 30px;
		font-size:20px;
		text-align: center;
		border-radius: 50%;
		background-color: cornflowerblue;
	}
	
	.content-num-before {
		/* padding-left: 11px; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.folder-order-info{
		width: 260px;
		/* border-style: solid; */
		/* border-width: 2px; */
		/* display: flex; */
		/* flex-direction: column; */
		padding: 5px 10px;
	}
	
	.mainInfo{
		text-align: left;
		font-weight: bold;
	   overflow: hidden;
	   /* 超过了就显示省略号 */
	       text-overflow: ellipsis;
	      /* webkit内核的浏览器 */
	       display: -webkit-box;
	       -webkit-line-clamp: 1;
	       -webkit-box-orient: vertical;
	}
	.extInfo{
		/* margin: 0px 0px 0px 10px; */
		text-align: left;
		overflow: hidden;
				display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
				-webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
				-webkit-line-clamp: 1; /** 显示的行数 **/
	}
	
	.content-right {
		/* padding-left: 35px; */
		text-align: right;
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
		/* font-size: 10px; */
		/* background-color: cornflowerblue; */
	}

</style>
