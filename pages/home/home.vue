<template>
	<!--index.wxml-->
	<view>
		<view class="background">
				<!-- <button class="home-top"></button> -->
			<view class="home-top" >
				<image mode="widthFix" class="home-top-img" src="/static/image/home-top.jpg"></image>
			</view>
			<view class="function-grid">
				<view class="function-grid-box" @tap="toPage('../placeorder/placeorder', true)">
					<view class="text-xsl text-sunway-blue "><text class="cuIcon-cart"></text></view>
					<view class="text-lg text-bold"><text>自助下单</text></view>
					<view class="text-sm text-grey"><text>ORDER</text></view> 
				</view>
				<view class="function-grid-box" @tap="toPage('../entrust/entrust', true)">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-edit"></text></view>
					<view class="text-lg text-bold"><text>检测委托</text></view>
					<view class="text-sm text-grey"><text>ENTRUST</text></view>
				</view>
				<view class="function-grid-box" @tap="toPage('../selectproject/selectproject', true)">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-searchlist"></text></view>
					<view class="text-lg text-bold"><text>任务查询</text></view>
					<view class="text-sm text-grey"><text>QUERY</text></view>
				</view>
				<view class="function-grid-box" @tap="toPage('../selectorder/selectorder?tabIndex=3', true)">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-evaluate"></text></view>
					<view class="text-lg text-bold"><text>客户评价</text></view>
					<view class="text-sm text-grey"><text>EVALUATE</text></view>
					<view class="tab-tag" v-if="toCommentCue > 0" >
						<block v-if="toCommentCue!=1">{{toCommentCue>99?'99+':toCommentCue}}</block>
					</view>
				</view>
				<view class="function-grid-box" @tap="toPage('../selecttodo/selecttodo', true)" v-if="todoShow">
					<view class="text-xsl text-sunway-blue"><text class="cuIcon-check"></text></view>
					<view class="text-lg text-bold"><text>待办/审批</text></view>
					<view class="text-sm text-grey"><text>TODO/AUDIT</text></view>
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
				<view class="popup-content" ><!-- <image mode="aspectFit" show-menu-by-longpress="true" src="../../static/image/qrCode.jpg"></image> --></view>
			</uni-popup>
		</view>
	
	</view>
</template>

<script>
	import home from './home.js';
	import utils from '../../common/util.js';
	export default {
		data () {
			return {
				toCommentCue : getApp().globalData.redDotCue.toCommentCue,
				tab1Cue : getApp().globalData.redDotCue.tab1Cue,
				todoShow : false,
			}
		},
		onLoad() {
			var that = this;
			uni.$on('toCommentCue', function(toCommentCue) {
				console.log('触发了提示更新事件')
				console.log(toCommentCue)
				that.toCommentCue = toCommentCue;
			})
		},
		onUnload() {
			uni.$off('toCommentCue');
		},
		onShow : function (e) {
			// if(!utils.isLogin()){
			// 	uni.navigateTo({
			// 		url: '../login/login?needBack=true',
			// 	})
			// 	return;
			// }
			this.todoShow =  getApp().globalData.userInfo.userId != undefined;
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
		},
	}
</script>

<style>
	@import url(../home/home.css);
</style>