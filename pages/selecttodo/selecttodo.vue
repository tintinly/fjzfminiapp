<template>
	<view>
		<view class="panel-body" v-if="todolist.length > 0">
		<!-- 	<view class="panel-title">
				<span ><text class="text-bold">待办</text></span>
			</view> -->
			<view class="panel-content">
				<!-- <iframe :src="host + '/module/index/workspaces/todo-panel?panel=2478&loginType=wxmpsso&openId=' + openId" ></iframe> -->
				<view class="panel-container">
					<view class="panel">
						<view class="panel-item-grid">
							<view :title="item.modelName" class="panel-item" hover-class="panel-item-active" @click="toPage(`../todoaudit/todoaudit?todoConfigId=${item.ext$.todoconfigid}&modelName=${item.modelName}`)" v-for="item in todolist">
								<span class="mark">{{item.qty}}</span>
								<image mode="aspectFit" :src="iconUrl(item.ext$.todoiconurl)" class="img">
								<p class="text">{{item.modelName}}</p>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../../common/util.js';
	import { HTTP } from '../../common/http.js';
	export default {
		data() {
			return {
				openId : getApp().globalData.openId,
				todolist : []
			}
		},
		computed : {
			iconUrl(e) {
			  return (e) => {
				if (!e) {
					return '../../static/icon/defaultTodoIcon.jpg'
				}
				return getApp().globalData.host + e;
			  };
			},
		},
		onLoad : function () {
			var _this = this;
			this.loadData();
			uni.$on('updateTodo', function(e) {
				_this.loadData();
			})
		},
		onUnload() {
			uni.$off('updateTodo');
		},
		onShow: function () {
			// this.loadData();
		},
		methods: {
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
			loadData() {
				var _this = this;
				utils.tryLimsLogin().then(res=>{
					console.log(res);
					var header = {};
					header['Cookie'] = res;
					HTTP(`/open/emc/module/bp/wechat/select-todo`,{}, header).then(res=>{
						_this.todolist = res.data
					}).catch(err=>{
					});
				}).catch(err=>{
					uni.navigateTo({
						url: '../limslogin/limslogin',
					});
				});
			}
		}
	}
</script>

<style>
   .panel-body {
	  margin : 20rpx;
	  padding : 5rpx;
	  background-color: #fff;
	  box-shadow: 0 0 8rpx 0 rgba(51,102,62,.1);
	  border-radius: 8rpx;
	  user-select: none;
	  height: 100%;
	  display: flex;
	  -webkit-box-orient: vertical;
	  -webkit-box-direction: normal;
	  flex-direction: column;
	}
	
	.panel-title { 
		display: flex;
		-webkit-box-pack: justify;
		justify-content: space-between;
		font-size: 28rpx;
		font-weight: 1400;
		height: 60rpx;
		line-height: 60rpx;
		padding-left: 16rpx;
		color: rgba(0,0,0,.85);
	}
	
	.panel-content {
		flex : 1;
		height : 0;
		min-height: 0;
	}
	
	.panel-item-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(4, 25%);
		text-align: center;
	}
	
	
	.panel-item {
		width: 175rpx;
		height: 175rpx;
		/* margin: 0 4rpx; */
		border-radius: 8rpx;
		position: relative;
	}
	
	.panel-item-active {
		background-color: var(--sunway-primary-background-color);
	}
	
	
	.img {
		max-width: 70rpx;
		position: absolute;
		top: 40rpx;
		right: 0;
		bottom: 0;
		left: 0;
		margin: 0 auto;
		max-height: 70rpx;
	}
	
	
	.mark {
		font-size: 20rpx;
		line-height: 25rpx;
		color: #fff;
		padding: 0 10rpx;
		background-color: #ff003c;
		border-radius: 15rpx;
		position: absolute;
		top: 14rpx;
		right: 14rpx;
	}
	
	.text {
		width: 100%;
		max-height: 40rpx;
		height: 40rpx;
		font-size: 22rpx;
		line-height: 23rpx;
		color: rgba(0,0,0,.65);
		margin: 0;
		padding: 0 6rpx;
		text-align: center;
		position: absolute;
		left: 0;
		bottom: 1rpx;
		overflow: hidden;
		white-space: normal;
		text-overflow: ellipsis;
	}

</style>
