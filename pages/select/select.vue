<template>
	<view>
	  <view class="allStytle">
	    <view class="leftStytle"></view>
	    <view class="rightStytle">
	      <view class="upStytle"></view>
	      <view class="select">
	        <view class="selectFormView">
	          <label>企业编码</label>
			  <input class="content-input" v-model="clientNo" type="number" placeholder="请输入10位企业编码"/>
	        </view>
	        <button class="submitButton" @click="submit"><text>查询</text></button>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script>
	
	export default {
		data () {
			return {
				clientNo : '',
				submitType : false
			}
		},
		methods: {
		
		
			submit : function(){
				if(this.clientNo.length == 10){
					this.submitType = true;
				}else{
					this.submitType = false;
					wx.showToast({
						title: '请输入正确的企业编号',
						icon: 'none',
						duration: 1500
					});
				}
				
				if(this.submitType){
				    wx.showLoading({
						title : '查询中'
					})
					wx.request({
						url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-contract',
						data : {
							clientNo : this.clientNo
						},
						method : getApp().globalData.method,
						success : (projectList) => {
							if(projectList.statusCode != 200){
								wx.showToast({
									title: '网络错误',
									icon: 'none',
									duration: 1500
								});
							}else if(projectList.data.length == 0){
								wx.showToast({
									title: '未查到相关信息',
									icon: 'none',
									duration: 1500
								});
							}else{
								var dataList = projectList.data;
								var projIds = [];
								var projNames = [];
								var projNodes = [];
								var files = [];
								for(var i = 0 ; i < dataList.length ; i++){
									projIds[projIds.length] = dataList[i].projId;
									projNames[projNames.length] = dataList[i].projName;
									projNodes[projNodes.length] = dataList[i].projNode;
									if(dataList[i].projFiles.length != 0){
										files[files.length] = dataList[i].projFiles;
									}
								}
								var projIdList = JSON.stringify(projIds);
								var projNodeList = JSON.stringify(projNodes);
								var projNameList = JSON.stringify(projNames);
								var fileList = JSON.stringify(files);
							    wx.hideLoading()
								wx.navigateTo({
									url: `../selectproject/selectproject?projIdList=${projIdList}&projNodeList=${projNodeList}&projNameList=${projNameList}&fileList=${fileList}`,
								});
							}
						}
					})
				}else{
					wx.showToast({
						title: '请输入正确的企业编码',
						icon: 'none',
						duration: 1500
					});
				}
			}
		},
	}
</script>

<style scoped>
	@import url(../select/select.css);
	@import url(../../common/uni-nvue.css);
	@import url(../../common/uni.css);
</style>