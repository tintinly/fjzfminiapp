<template>
	<!--index.wxml-->
	<view>
		<view class="background">
				<!-- <button class="home-top"></button> -->
			<view class="home-top"  ></view>
			<!-- 	<view class="item">
					<button class="button1" @tap="placeorder"></button>
					<button class="button2" @tap="select"></button>
				</view>
	 -->
			<view class="function-grid">
				<view class="function-grid-box" @tap="placeorder">
					<view class="text-xsl text-sunway-blue "><text class="cuIcon-cart"></text></view>
					<view class="text-lg text-bold"><text>自助下单</text></view>
					<view class="text-sm text-grey"><text>ORDER</text></view>
				</view>
				<view class="function-grid-box" @tap="entrust">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-edit"></text></view>
					<view class="text-lg text-bold"><text>检测委托</text></view>
					<view class="text-sm text-grey"><text>ENTRUST</text></view>
				</view>
				<view class="function-grid-box" @tap="selectProject">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-searchlist"></text></view>
					<view class="text-lg text-bold"><text>任务查询</text></view>
					<view class="text-sm text-grey"><text>QUERY</text></view>
				</view>
				<view class="function-grid-box" @tap="openComment">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-evaluate"></text></view>
					<view class="text-lg text-bold"><text>客户评价</text></view>
					<view class="text-sm text-grey"><text>EVALUATE</text></view>
					<view class="tab-tag" v-if="toCommentCue > 0" >
						<block v-if="toCommentCue!=1">{{toCommentCue>99?'99+':toCommentCue}}</block>
					</view>
				</view>
			</view>
			
			<button class="button-image bg-sunway-blue"  @click="toggle('center')">
				<view class="button-text1 text-df">
					<text class="  text-white">关注公众号</text>
				</view>
				<view class="button-text2 text-df ">
					<text class="text-white">了解中孚更多信息</text>
				</view>
				
				<image mode="aspectFit"  src="../../static/image/qrCode.jpg"></image></button>
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<view class="popup-content" ><image mode="aspectFit" show-menu-by-longpress="true" src="../../static/image/qrCode.jpg"></image></view>
			</uni-popup>
		</view>
	
	</view>
</template>

<script>
	import home from './home.js'
	export default {
		data () {
			return {
				toCommentCue : getApp().globalData.redDotCue.toCommentCue,
				tab1Cue : getApp().globalData.redDotCue.tab1Cue,
			}
		},
		onLoad() {
		  var that = this;
		  var UserLogin = getApp().globalData.UserLogin;
		  if(!UserLogin){
			   uni.reLaunch({
				 url: '../login/login',
			   })
		  }
		  uni.$on('toCommentCue', function(toCommentCue) {
			  console.log('触发了提示更新事件')
			  console.log(toCommentCue)
			  that.toCommentCue = toCommentCue;
		  })
		},
		onShow : function (e) {
			console.log('2');
			this.toCommentCue = getApp().globalData.redDotCue.toCommentCue
			this.tab1Cue = getApp().globalData.redDotCue.tab1Cue;
			if (Number(this.tab1Cue) > 0) {
				uni.setTabBarBadge({
					index: 1,
					text: String(this.tab1Cue),
				});
			} else {
				uni.hideTabBarRedDot({
					index: 1
				});
			}
		},
		methods:{
			change(e) {
				console.log('当前模式：' + e.type + ',状态：' + e.show);
			},
			toggle(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			placeorder(e){
			  wx.navigateTo({
			    url: '../placeorder/placeorder',
			  })
			},
			selectProject(e){
			  wx.navigateTo({
			    url: '../selectproject/selectproject?clientNo=' + getApp().globalData.userInfo.clientNo,
			  })
			},
			entrust(e) {
				wx.navigateTo({
				  url: '../entrust/entrust',
				})
			},
			openComment(e) {
				wx.navigateTo({
				  url: '../selectorder/selectorder?tabIndex=3',
				})
				// uni.showLoading({
				// 	title : '请等候'
				// })
				// uni.request({
				// 	url:  getApp().globalData.host + '/open/emc/module/bp/wechat/select-questionnaire-url',
				// 	method : getApp().globalData.method,
				// 	success : (res) => {
				// 		var data = res.data;
				// 		if (data.questionnaireUrl == undefined) {
				// 			uni.showToast({
				// 				title : '暂无评价问卷',
				// 				icon : 'none'
				// 			})
				// 			return
				// 		}
				// 		var questionnaireUrl = data.questionnaireUrl;
				// 		var sid = data.sid;
				// 		var hash = data.hash;
				// 		uni.hideLoading()
				// 		wx.openEmbeddedMiniProgram({
				// 		  appId: 'wxebadf544ddae62cb',
				// 		  path : `pages/survey/index?sid=${sid}&hash=${hash}&navigateBackMiniProgram=true`
				// 		});
				// 	} 
				// })
			}
		},
	}
</script>

<style>
	@import url(../home/home.css);
</style>