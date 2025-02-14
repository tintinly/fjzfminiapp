<template>
	<view class="gradual-bg">
		<sunway-navbar title="个人中心" :titleShow="false" :backShow="false" :blankHold="false"></sunway-navbar>
		
		<view class="userInfo-box" :style="'padding-top:' + navHeight + 'px;'">
			<view class="userAvatar-box"  @click="toPage('../mydetail/mydetail', true)">
				<image :src="myInfo.avatarUrl"></image>
			</view>
			<view class="userlogin"  @click="toPage('../mydetail/mydetail', true)">
				<view class="margin-bottom-sm">
					<text class="text-lg text-white  text-left">{{myInfo.nickName}}</text>
				</view>
				<!-- <view>
					<text class="text-sm text-white text-left">{{myInfo.phoneNumber}}</text>
				</view> -->
			</view>
			<view class="userNotice"  @click="toPage('../todo/todo')">
				<view class="cuIcon-notice text-white "></view>
			</view>
		</view>
		
			
		<view class="cu-list grid col-2  card-menu ">
			<!-- <view class="cu-item" @click="toPage('../selectorder/selectorder', true)"> -->
			<view class="cu-item" @click="toPage('../todo/todo', true)">
				<view class="cuIcon-cart text-sunway-blue" >
					<view v-if="orderCue > 0" class="cu-tag badge" >
						<block v-if="orderCue!=1">{{orderCue > 99 ? "99+" : orderCue}} </block>
					</view>
				</view>
				<text>我的订单</text>
			</view>
			<view class="cu-item" @click="toPage('../selectentrust/selectentrust', true)">
				<view class="cuIcon-edit text-sunway-blue" >
					<view v-if="entrustCue > 0" class="cu-tag badge" >
						<block v-if="entrustCue!=1">{{entrustCue > 99 ? "99+" : entrustCue}} </block>
					</view>
				</view>
				<text>我的委托</text>
			</view>
		
		</view>
		
		
		
		<view class="margin-left-sm margin-xs" >
			<image mode="heightFix" class="zfjc-image" src="/static/image/loginpic3.png"></image>
		</view>
		<view class="cu-list menu card-menu  margin-bottom-xl shadow-lg">
			<view class="cu-item arrow" >
				<view class="content" @click="toPage('../selectinvoice/selectinvoice', true)">
					<text class="cuIcon-ticket text-sunway-blue"></text>
					<text class="text-black">发票管理</text>
				</view>
			</view>
			<view class="cu-item arrow" >
				<view class="content" @click="toPage('../mydetail/mydetail', true)">
					<text class="cuIcon-people text-sunway-blue"></text>
					<text class="text-black">个人资料</text>
				</view>
			</view>
			<view class="cu-item arrow" @click="toPage('../about/about')">
				<view class="content">
					<image src="../../static/image/loginpic.jpg" class="png" mode="aspectFit"></image>
					<text class="text-black">关于中孚</text>
				</view>
			</view>
			<view class="cu-item arrow" @click="toPage('../customerservice/customerservice')">
				<view class="content">
					<text class="cuIcon-service text-sunway-blue"></text>
					<text class="text-black">联系客服</text>
				</view>
			</view>
			<view class="cu-item arrow" @click="toPage('../feedback/feedback', true)">
				<view class="content">
					<text class="cuIcon-comment text-sunway-blue"></text>
					<text class="text-black">建议与反馈</text>
				</view>
			</view>
		
		</view>
		<view class="cu-list menu card-menu  margin-bottom-xl shadow-lg">
			<view class="cu-item arrow" @click="toPage('../option/option', true)">
				<view class="content">
					<text class="cuIcon-settingsfill text-sunway-blue"></text>
					<text class="text-black">设置</text>
				</view>
			</view>
		</view>

		
	</view>
</template> 
<script>
	import my from './my.js';
	import utils from '../../common/util.js';
	export default {
		data () {
			return {
				navHeight	 : getApp().globalData.navHeight,
				
				UserLogin : false,
				Adminstator: false,
				TapAccount: 0,
				unPayNum : getApp().globalData.unPayNum,
				//用户信息
				myInfo : {
					avatarUrl : '../../static/icon/defaultAvatar.jpg',
					nickName : '微信用户'
				},
				// 提示信息
				orderCue : getApp().globalData.redDotCue.orderCue,
				entrustCue : getApp().globalData.redDotCue.entrustCue,
				tab1Cue : getApp().globalData.redDotCue.tab1Cue,
				// 其他信息
				cartIcon: {
					color: '#4aa1ed',
					size: '22',
					type: 'cart-filled'
				},
				gearIcon: {
					color: '#4aa1ed',
					size: '22',
					type: 'gear-filled'
				},
				personIcon: {
					color: '#4aa1ed',
					size: '22',
					type: 'person-filled'
				},
				phoneIcon: {
					color: '#4aa1ed',
					size: '22',
					type: 'phone-filled'
				},
				chatbubbleIcon: {
					color: '#4aa1ed',
					size: '22',
					type: 'chatbubble-filled'
				}
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function (options) {
			uni.$on('updateAvatar',this.updateAvatar)
			uni.$on('updateUserInfo',this.updateUserInfo)
		},
		onUnload() {
			uni.$off('updateAvatar');
			uni.$off('updateUserInfo');
		},
		onShow : function (e) {
			// if(!utils.isLogin()){
			// 	uni.navigateTo({
			// 		url: '../login/login?needBack=true',
			// 	});
			// 	return;
			// }
			if(!utils.isLogin()){
				this.myInfo.nickName = '点击 登录 / 注册'
				return;
			}
			// 用户信息
			this.userInfo = getApp().globalData.userInfo
			if (this.userInfo.avatar != undefined && this.userInfo.avatar != '') {
				this.myInfo.avatarUrl = getApp().globalData.host + this.userInfo.avatar
			}
			if (this.userInfo.phoneNumber != undefined && this.userInfo.phoneNumber != '') {
				this.myInfo.phoneNumber = this.userInfo.phoneNumber
			}
			if (this.userInfo.nickName != undefined && this.userInfo.nickName != '') {
				this.myInfo.nickName = this.userInfo.nickName
			}
			
			
			this.orderCue = getApp().globalData.redDotCue.orderCue
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
			// 跳转函数
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
			updateAvatar : function (e)	 {
				console.log('触发了更新头像事件')
				this.myInfo.avatarUrl = e.avatarUrl
			},
			updateUserInfo : function (e)	 {
				console.log('触发了信息事件',e)
				this.myInfo.nickName = e.nickName
				this.myInfo.phoneNumber = e.phoneNumber
			},
		}
	}
</script>

<style scoped>
	@import url(../my/my.css);


</style>