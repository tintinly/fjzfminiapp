<template>
	<view>
		<web-view :src="officialWebsite"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				officialWebsite : getApp().globalData.officialWebsite
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
