<template>
	<view>
		<!-- 是否占据顶部空白-->
		<view class="nav-bar-no-fiexd" :style="'height:' + navHeight + 'px;' " v-if="blankHold"></view>
		
		<view class="nav-bar-fiexd" :style="'height:' + navHeight + 'px;' ">
			<view class="nav-bar" :style="'top:' + statusbarHeight + 'px;' + 'height:' + nav + 'px'" >
				<view class="back-button"  @click="back" v-if="backShow">
					<uni-icons   custom-prefix="iconfont" type="icon-31fanhui1" size="20" color="black" ></uni-icons>
				</view>
				<view class="nav-title" >
					<text class="text-xl text-black" v-if="titleShow">{{title}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"sunway-navbar",
		props:{
			blankHold :{
				type: Boolean,
				default: true
			},
			title:{
				type: String,
				default: '导航栏'
			},
			titleShow:{
				type: Boolean,
				default: true
			},
			backShow:{
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				//导航栏相关
				nav : getApp().globalData.nav,
				navHeight	 : getApp().globalData.navHeight,
				statusbarHeight : getApp().globalData.navHeight - getApp().globalData.nav,
			}
		},
		methods: {
			back : function(e) {
			// 在C页面内 navigateBack，将返回A页面
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style>
	.nav-bar-no-fiexd {
		width: 100%;
	}
	
	.nav-bar-fiexd {
		width: 100%;
		position:fixed;
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
</style>
