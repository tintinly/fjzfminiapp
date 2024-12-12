<template>
	<view>
		<view  class="o-empty">
			<image mode="aspectFit" :src="imgSrc"></image>
			<view class="o-empty-text">暂无数据</view>
			<view class="o-empty-slot" > <slot></slot> </view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'oEmpty',
		props:{
			imgSrc:{
				type:String,
				default:'e'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.o-empty{
	display: flex;
	flex-direction: column;
	padding: 64rpx 0!important;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}

.o-empty-text {
	color:#969798;
	padding: 20rpx 0;
}

.o-empty-slot{
	padding-top: 20rpx;
}
</style>
