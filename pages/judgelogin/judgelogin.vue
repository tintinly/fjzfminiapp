<template>
	<view>
		
	</view>
</template>

<script>
	import utils from '../../common/util.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onLoad() {
			if(!utils.isLogin()){
				uni.reLaunch({
					url: '../login/login',
				})
			} else {
				uni.reLaunch({
					url: '../home/home',
				})
			}
		},
	}
</script>

<style>

</style>
