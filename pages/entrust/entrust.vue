<template>
	<view >
		<view v-if="warning" class="topTip">
			<text class="cuIcon-warn text-yellow margin-right-sm"></text><text class="">未找到所属企业，请前往<text class="text-blue" @click="toPage('../mydetail/mydetail', true)">个人信息</text>中维护</text>
		</view>
		<view class="content-box ">
			<view class="content-row solid-bottom">
				<view class="title-bar bg-white  ">
					<view class="margin-left">
						图片上传
					</view>
					
					<view class="margin-right">
						{{imgList.length}}/4
					</view>
				</view>
				<view class="content-bar">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						 <image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="content-row ">
				<view class="title-bar bg-white ">
					<view class="margin-left">
						委托内容
					</view>
					<view class="margin-right">
						{{wordCount}}/200
					</view>
				</view>
					
				<view class="content">
					<textarea name="opinion" @input="spyInput" maxlength="200" :value="entrustContent" placeholder-class="placeholder" placeholder="请描述检测委托内容(受检单位信息,检测点位,检测项目等)" />
				</view>
			</view>
			
		</view>
		
		
		<button class="button bt-sunway-blue" @click="submit"><text class="text-white">提交</text></button>
		
	</view>

</template>

<script>
	import utils from '../../common/util.js';
	export default {
		data() {
			return {
				imgList: [],
				entrustContent : '',
				wordCount : 0,
				clientContactId : getApp().globalData.userInfo.clientContactId,
			}
		},
		computed : {
			warning(e) {
				return this.clientContactId == undefined || this.clientContactId == '';
			},
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options){
			uni.$on('updateUserInfo',this.updateUserInfo)
			this.loadData();
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
			updateUserInfo : function(e) {
				this.clientContactId = e.clientContactId
			},
			spyInput:function(e){
				console.log(e)
			   this.wordCount = e.detail.cursor
			   this.entrustContent = e.detail.value
			},
			loadData : function(e)	 {
				
			},
			ChooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					},
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			submit : function(e) {
				if (!this.validateForm()) {
					return
				}
				uni.showModal({
					title: '确定',
					content: '确定提交该委托单？',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '上传中'
							})
							uni.request({
								url: getApp().globalData.host + '/open/emc/module/bp/wechat/submit-entrust',
								data : {
									entrustContent : this.entrustContent,
									openId : getApp().globalData.openId,
									clientId : getApp().globalData.userInfo.clientId,
									clientContactId : getApp().globalData.userInfo.clientContactId
								},
								method : 'POST',
								success : (enTrustId) =>{
									console.log('enTrustId',enTrustId)
									if (enTrustId.statusCode==500) {
										uni.hideLoading()
										uni.showToast({
											title:'提交时发生错误',
											duration:1500,
											icon:'none'
										})
									} else if (enTrustId.statusCode==404) {
										uni.hideLoading()
										uni.showToast({
											title:'网络错误',
											duration:1500,
											icon:'error'
										})
									} else {
										// 上传照片 至 lims系统附件
										if (this.imgList.length > 0) {
											for (var i = 0; i < this.imgList.length; i++) {
												var fileIndex = i;
												uni.uploadFile({
													url: getApp().globalData.host + '/open/emc/module/bp/wechat/upload-file',
													filePath: this.imgList[i],
													name:  'file', 
													formData: {
														'targetId' : "T_EMC_WX_ENTRUST$" + enTrustId.data,
														'fileName' : '委托单附照' + fileIndex + 1
													},
													success: (uploadFileRes) => {
															console.log(uploadFileRes)
																
															if (uploadFileRes.statusCode === 500) {
																uni.hideLoading()
																uni.showToast({
																	title : '上传图片错误',
																	icon: 'error',
																	duration : 1500,
																})
												
															} else{
																uni.hideLoading()
																uni.navigateBack()
																uni.showModal({
																	title: '提示',
																	content: '请前往【我的->我的委托】查看委托单',
																	showCancel : false,
																});
																											
															} 
													},
													fail : (uploadFileRes) =>{
														uni.hideLoading()
														uni.showToast({
															title : '上传图片错误',
															icon: 'error',
															duration : 1500,
														})
													}
												});
											}
										} else {
											uni.hideLoading()
											uni.navigateBack()
											uni.showModal({
												title: '提示',
												content: '请前往【我的->我的委托】查看委托单',
												showCancel : false,
											});
										}
									}
								
								
								},
								fail : res=>{
									uni.hideLoading()
									uni.showToast({
										title : '提交错误',
										icon: 'error',
										duration : '1500',
									})
								}
							})
						}
						
		
					}
				})
			},
			validateForm : function(e) {
				var clientContactId = getApp().globalData.userInfo.clientContactId;
				if (clientContactId == undefined || clientContactId == '') {
					uni.showToast({
						title: '未找到您所属的企业',
						duration: 1500,
						icon : 'none'
					});
					return false
				} else if (this.entrustContent == '' && this.imgList.length === 0) {
					uni.showToast({
						title: '请上传照片或输入委托内容',
						duration: 1500,
						icon : 'none'
					});
					return false
				} else {
					return true;
				}
			}
		}
		
	}
</script>

<style >
	@import url(../entrust/entrust.css);
</style>
