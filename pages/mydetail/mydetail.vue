<template>
	<view class="bg-container">
		
		<view class="info-box">
			<view class="info-line">
				<view><text>头像</text></view>
				<view>
					<button class="choose-avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<image :src="myInfo.avatarUrl"></image>
					</button>
				</view>
				
				<!-- <view><image :src="myInfo.avatar"></image></view> -->
			</view>
			<view class="info-line">
				<view><text>昵称</text></view>
				<view><input type="nickname" placeholder="请填写" v-model="myInfo.nickName"/></view>
			</view>
			<view class="info-line">
				<view><text>姓名</text></view>
				<view><input placeholder="请填写" v-model="myInfo.name"/></view>
			</view>
			<view class="info-line">
				<view><text>手机号</text></view>
				<view><text>{{myInfo.phoneNumber}}</text></view>
			</view>
			<view class="info-line">
				<view><text>性别</text></view>
				<view>
			<!-- 		<radio-group @change="sexChange">
						<radio class='blue basis-lg margin-lr-sm' :class="myInfo.sex==0?'checked':''" :checked="myInfo.sex==0?true:false" value=0></radio>
						<text>男</text>
						<radio class='blue basis-lg margin-lr-sm' :class="myInfo.sex==1?'checked':''" :checked="myInfo.sex==1?true:false" value=1></radio>
						<text>女</text>
					</radio-group> -->
					<radio-group name="sex" @change="sexChange">
						<label for="man" >
							<radio id="man" color="#4aa1ed" value=0 :checked="myInfo.sex==0?true:false" />
							<text>男</text>
						</label>
						<label for="woman" >
							<radio id="woman" color="#4aa1ed" value=1 :checked="myInfo.sex==1?true:false" />
							<text>女</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="info-line">
				<view><text>生日</text></view>
				<picker mode="date" :value="myInfo.birthday" start="1973-04-03" end="2099-12-31" @change="birthdayChange">
					{{myInfo.birthday}}<text class="cuIcon-right"></text>
				</picker>
			</view>
		</view>
		
		<view class="info-box">
			<view class="info-title"><text class="text-bold text-lg">企业信息</text></view>
			<view class="info-line">
				<view><text>企业名称</text></view>
				<view><text>{{myInfo.clientName}}</text></view>
			</view>
			<view class="info-line">
				<view><text>企业地址</text></view>
				<view><text>{{myInfo.address}}</text></view>
			</view>
		</view>
		
		<button class="button bt-sunway-blue"  @click="saveUserInfo"><text class="text-white">保存</text></button>
		<button class="button bg-white"  @click="logout"><text class="text-black">退出登录</text></button>
		
		
		
		
		<!-- <uni-card :is-shadow="true" is-full>
			<text class="uni-h6">完善个人信息以及企业信息。</text>
		</uni-card>
		

		
		<button  class="button bg-sunway-blue" v-if="!inputType" @click="changeDetail">修改基本信息</button>
		<button  class="button bg-sunway-blue" v-else  @click="submit">保存</button> -->
	</view>
</template>

<script>
	import myDetail from './mydetail.js'
	import utils from '../../common/util.js';
	export default {
		data () {
			return {
				userInfo : {},
				myInfo : {
					avatarUrl : '../../static/icon/defaultAvatarBlack.jpg',
					avatar : '',
					nickName : '',
					name : '',
					phoneNumber : '',
					sex : '',
					birthday : '完善生日信息',
					lxrMail : '',
					clientNo : '',
					clientName : '',
					address : '',
				},
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options){
			this.loadData();
		},
		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload(){
			var ss = getApp().globalData.userInfo;
			if(getApp().globalData.userInfo == {}){
				return;
			}
			wx.switchTab({
				url: '../my/my',
			});
		},
		methods:{
			back : function(e) {
			// 在C页面内 navigateBack，将返回A页面
				uni.navigateBack({
					delta: 1
				});
			},
			birthdayChange : function (e){
				this.myInfo.birthday = e.detail.value
			},
			sexChange : function (e){
				this.myInfo.sex = e.detail.value
			},
			onChooseAvatar: function(e) {
				this.myInfo.avatarUrl = e.detail.avatarUrl
		    },
			// 返回 上传头像promise对象 构造器
			uploadAvatar : function()	 {
				return new Promise((resolve,reject)=>{
					console.log('上传头像',this.myInfo.avatarUrl ) 
					if (this.myInfo.avatarUrl == undefined) {
						resolve('')
					}
					uni.uploadFile({
						url: getApp().globalData.host + '/open/emc/module/bp/wechat/upload-file',
						filePath: this.myInfo.avatarUrl,
						name:  'file', 
						formData: {
							'targetId' : "T_EMC_CLIENT_CONTACT$wx" +  getApp().globalData.openId,
							'fileName' : '用户头像',
						},
						success: (uploadFileRes) => {
							if (uploadFileRes.statusCode === 500) {
								uni.$emit('updateAvatar',{
									avatarUrl : this.myInfo.avatarUrl
								})
								resolve(this.myInfo.avatar)
							} else {
								uni.$emit('updateAvatar',{
									avatarUrl : getApp().globalData.host + uploadFileRes.data
								})
								resolve(uploadFileRes.data)
							}
						},
						fail : (uploadFileRes) => {
							uni.$emit('updateAvatar',{
								avatarUrl : this.myInfo.avatarUrl
							})
							resolve(this.myInfo.avatar)
						}
					})
				})
			},
			saveUserInfo :function(){
				console.log('我的信息', this.myInfo);
				var _this = this;
				uni.showLoading();
				this.uploadAvatar().then(uri=>{
					console.log('头像路径', uri)
					this.myInfo.avatarUrl = getApp().globalData.host + uri
					this.myInfo.avatar = uri
					wx.request({
						url: getApp().globalData.host + '/open/emc/module/bp/wechat/update-client',
						data: {
							openId : getApp().globalData.openId,
							userInfo : _this.myInfo,
						},
						method : getApp().globalData.method,
						success: (res) =>{
							if (res.statusCode == "500") {
								wx.hideLoading();
								uni.showModal({
									title: '更新错误',
									icon : 'error',
									success : res=>{
									}
								});
					
							} 
								
							var userInfo = res.data;
							_this.userInfo = userInfo;
							this.loadData();
							uni.hideLoading();
							uni.showToast({
								title: '更新成功',
								icon : 'none',
								duration: 1000,
								success : res=>{
									setTimeout(function () { 
										_this.back();
									 }, 1000) 
								}
							});
						},
						fail: clientData=>{
							uni.showToast({
								title: '保存用户信息失败',
								icon: 'none',
								duration: 1500,
							});
							
						}
					})
				})
			},
			loadData : function(options){
				var _utils = utils;
				wx.request({
					url : getApp().globalData.host + '/open/emc/module/bp/wechat/select-client-detail',
					data : {
						openId : getApp().globalData.openId,
						phoneNumber : getApp().globalData.phoneNumber
					},
					method : 'POST',
					success : (clientData) =>{
						wx.setStorageSync('userInfo', clientData.data);
						// _utils.IsLogon();
						this.userInfo = clientData.data;
						// 用户信息
						if (this.userInfo.avatar != undefined && this.userInfo.avatar != '') {
							this.myInfo.avatar = this.userInfo.avatar;
							this.myInfo.avatarUrl = getApp().globalData.host + this.userInfo.avatar;
						}
						if (this.userInfo.birthday != undefined && this.userInfo.birthday != '') {
							var date = utils.dateUtils.parse(this.userInfo.birthday);
							this.myInfo.birthday = utils.dateUtils.dateToStr(date);
						}
						this.myInfo.nickName = this.userInfo.nickName;
						this.myInfo.name = this.userInfo.lxrName;
						this.myInfo.phoneNumber = this.userInfo.lxrPhone;
						this.myInfo.lxrMail = this.userInfo.lxrMail;
						this.myInfo.sex = this.userInfo.sex;
						this.myInfo.clientName = this.userInfo.clientName;
						this.myInfo.clientNo = this.userInfo.clientNo;
						this.myInfo.address = this.userInfo.address;
						uni.$emit('updateInfo',{
							nickName : this.myInfo.nickName,
							phoneNumber : this.myInfo.phoneNumber
						})
					},
					fail : clientData=>{
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
			},
			logout : function(e) {
				uni.showLoading({
					title: '正在退出'
				});
				getApp().globalData.openId = ''
				getApp().globalData.phoneNumber = ''
				getApp().globalData.userInfo = []
				try {
					uni.clearStorageSync();
				} catch (e) {
					// error
				}
				utils.IsLogon();
				var UserLogin = getApp().globalData.UserLogin;
				if(!UserLogin){
					uni.hideLoading()
					wx.reLaunch({
					  url: '../login/login',
					})
				}
			},
		}
	}
</script>
<style >
	@import url(../mydetail/mydetail.css);
</style>
