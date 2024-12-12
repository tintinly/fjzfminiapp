<template>
	<view class="container">
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">请完善个人信息以及企业信息，以完成注册</text>
		</uni-card>
		<uni-section title="用户信息" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="userInfo" :model="userInfo" labelWidth="80px" :rules="userInfoRules">
				
					<uni-forms-item label="头像" >
		<!-- 				<view class="example-body custom-image-box">
							<uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" file-mediatype="image">选择</uni-file-picker>
						</view> -->
						<view class="userAvatar">
							<text class="userAvatar-text" v-text="avatarDesc"></text>
							<button class="userAvatar-box" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image class="userAvatar-image" :src="userInfo.avatar"></image>
							</button>
						</view>
					</uni-forms-item>
					<uni-forms-item label="昵称" >
						<uni-easyinput type="nickname" v-model="userInfo.nickName" placeholder="请输入昵称" />
					</uni-forms-item>

				</uni-forms>
			</view>
		</uni-section>
		<uni-section title="个人信息" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
			
				<uni-forms ref="personInfo" :model="personInfo" labelWidth="80px" :rules="personInfoRules">
		
					<uni-forms-item label="姓名" required name="name">
						<uni-easyinput v-model="personInfo.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="联系方式" required name="phoneNumber">
						<uni-easyinput disabled="true" v-model="personInfo.phoneNumber" placeholder="请输入联系方式" />
					</uni-forms-item>
					<uni-forms-item label="性别" >
						<uni-data-checkbox v-model="personInfo.sex" :localdata="sexs" />
					</uni-forms-item>
					<uni-forms-item label="生日">
						<uni-datetime-picker type="date" v-model="personInfo.birthday" />
					</uni-forms-item>
		
				</uni-forms>
			</view>
		</uni-section>
		<uni-section title="企业信息" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
			
				<uni-forms ref="companyInfo" :model="companyInfo" labelWidth="80px" :rules="companyInfoRules">
					<uni-forms-item label="企业名称" required name="clientName">
						<uni-easyinput v-model="companyInfo.clientName" placeholder="请输入所属企业名称" />
					</uni-forms-item>
					<uni-forms-item label="企业地址" required name="address">
						<uni-easyinput v-model="companyInfo.address" placeholder="请输入企业地址" />
					</uni-forms-item>
					<uni-forms-item label="企业邮箱" required name="mail">
						<uni-easyinput v-model="companyInfo.mail" placeholder="请输入企业邮箱" />
					</uni-forms-item>
				</uni-forms>
	
			</view>
		</uni-section>

		
		<button type="primary" class="button" @click="submit">保存</button>
	</view>
</template>

<script>
	import logon from './logon.js'
	import utils from '../../common/util.js';
	export default {
		data () {
			return {
				userInfo : {},
				//用户信息
				avatarDesc : "请选择头像",
				userInfo : {
					avatar : '../../static/icon/defaultAvatar.png',
					nickName : '',
				},
				//个人信息
				personInfo : {
					name : '',
					phoneNumber : '',
					birthday : '',
					mail : '',
					sex : '',
				},
				//企业信息
				companyInfo : {
					clientNo : '',
					clientName : '',
					address : '',
					mail : '',
				},
				// 性别选项
				sexs: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '保密',
					value: 2
				}],
				//表单验证规则
				personInfoRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '姓名不能为空',
						}]
					},
				},
				companyInfoRules: {
					clientName: {
						rules: [{
							required: true,
							errorMessage: '企业名称不能为空',
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '企业地址不能为空',
						}]
					},
					mail: {
						rules: [{
							required: true,
							errorMessage: '企业邮箱不能为空',
						}]
					},
				}	
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options){
			this.loadData("logon");
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		methods:{
			onChooseAvatar: function(e) {
			    console.log("avatarUrl",e.detail.avatarUrl)
				this.userInfo.avatar = e.detail.avatarUrl
				this.avatarDesc = ""
		    },
			async validateForm()	 {
				var validateFlag = true
				await this.$refs.personInfo.validate().then(res=>{
					console.log('表单数据信息：', res);
				}).catch(err =>{
					console.log('表单错误信息：', err);
					validateFlag = false
				})
				await this.$refs.companyInfo.validate().then(res=>{
					console.log('表单数据信息：', res);
				}).catch(err =>{
					console.log('表单错误信息：', err);
					validateFlag = false
				})

				return validateFlag;

			},
			// 返回 上传头像promise对象 构造器
			uploadAvatar : function()	 {
				return new Promise((resolve,reject)=>{
					console.log('beforeAvatar',this.userInfo.avatar ) 
					if (this.userInfo.avatar == undefined) {
						resolve('')
					}
					uni.uploadFile({
						url: getApp().globalData.host + '/open/emc/module/bp/wechat/upload-file',
						filePath: this.userInfo.avatar,
						name:  'file', 
						formData: {
							'targetId' : "T_EMC_CLIENT_CONTACT$wx" +  getApp().globalData.openId,
							'fileName' : '用户头像',
						},
						success: (uploadFileRes) => {
							if (uploadFileRes.statusCode === 500) {
								console.log('500')
								resolve(this.userInfo.avatar)
							} else {
								console.log('sucess')
					
								resolve(uploadFileRes.data)
							}
						},
						fail : (uploadFileRes) => {
							console.log('fail')
						
							resolve(this.userInfo.avatar)
						}
					})
				})
			},
			submit :function(){
				var _utils = utils;
				this.validateForm().then(flag=> {
					if (flag) {
						var openId = wx.getStorageSync('openId');
						var _this = this;
						uni.showLoading({
							title: '数据加载中...'
						});
						// 先上传头像
						this.uploadAvatar().then(url=>{
							console.log('afterurl', url)
							this.userInfo.avatar = url
							wx.request({
								url: getApp().globalData.host + '/open/emc/module/bp/wechat/update-client',
								data: {
									openId : openId,
									clientId : _this.userInfo == undefined ? '' : _this.userInfo.clientId,
									userInfo : this.userInfo,
									personInfo : this.personInfo,
									companyInfo : this.companyInfo
								},
								method : getApp().globalData.method,
								success: (res) =>{
									console.log(res)
									if (res.statusCode == "500") {
										wx.hideLoading();
										uni.showModal({
											title: '错误',
											content: res.data.message,
											showCancel : false,
										});
										return
									} 
									this.loadData('login');
				
								},
								fail: clientData=>{
									wx.showToast({
										title: '保存用户信息失败',
										icon: 'none',
										duration: 1500,
									});
								}
							})
						})
					}
				})
			},
			loadData : function(options){
				var _utils = utils;
				if(options == 'login'){
					wx.request({
						url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
						data : {
							openId : getApp().globalData.openId,
							phoneNumber : getApp().globalData.phoneNumber
						},
						method : 'POST',
						success : (clientData) =>{
							wx.setStorageSync('userInfo', clientData.data);
							_utils.IsLogon();
							uni.switchTab({
								url: '../home/home',
							})
						},
						fail : clientData=>{
							console.log(clientData);
							wx.switchTab({
								url : '../my/my',
							});
							wx.showToast({
								title : '查询用户信息失败',
								icon : 'none',
								duration : 1500
							});
						}
					})
				}else if (options == 'logon'){
					this.personInfo.phoneNumber = wx.getStorageSync('phoneNumber');//若为新注册用户 直接取微信关联手机号
				} else {
					
				}
			}
		}
	}
</script>
<style lang="scss">
	.container {
		padding: 15px;
		background-color: #fff;
	}
	
	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button{
		border-radius: 80rpx;
		margin: 40rpx 50rpx;
		font-size: 35rpx;
	}
	
	
	.userAvatar {
		display:flex;
		flex-direction:row;
		align-items: center;
	}
	
	.userAvatar-text {
		width: 168px;
		height: 38px;
	    // margin-left: 20%;
		text-align: center;
	}
	
	
	.userAvatar-box {
	    width: 60px;
	    height: 60px;
	    // margin-left: 70%;
		border-radius: 50%;
		// overflow:hidden;
		// display:flex;
	}
	
	
	.userAvatar-image {
		max-width: unset;
	    width: 60px;
	    height: 60px;
		margin-left : -48%;
		border-style: solid;
		border-width: 1rpx;
		border-color: white;
		border-radius: 50%;
	}


	
</style>
