<template>
	<view>
		<view class="margin padding-sm bg-white border-radius" @longpress="copy">
			<text class="text-bold">{{company}}\n</text>
			<text>{{contact}}</text><text style="color: blue;"  @tap="callPhone" >{{phoneNumber}}</text><text>\n</text>
			<text>{{email}}\n</text>
			<text>{{address}}\n</text>
		</view>
	
		<button  class="button bt-sunway-blue" open-type='contact'><text class="text-white">客服会话</text></button>
	<!-- 	<uni-group class="map-card" mode="card" >
			<view class="map">
				<map id="map"
				show-location="true" >     
				</map>
			</view>
		</uni-group> -->
		<!-- <button type="sucess" class="cu-btn"  @click="copy"> 测试</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				company : '福建省中孚检测技术有限公司',
				contact : '联系电话：', phoneNumber : 'xxxx-xxxxxxxx',
				email : '公司邮箱：654497433@qq.com',
				address : '公司地址：福建省漳州市龙文蓝田开发区檀林路42号'
			}
		},
		methods: {
			/*拨打电话*/
			callPhone(e){
				var phoneNumber = this.phoneNumber
			    wx.makePhoneCall({
					phoneNumber: phoneNumber
				});
			},
			copy(e) {
				var copyContent = this.company + '\n'+ this.contact + this.phoneNumber + '\n' + this.email + '\n' + this.address;
				console.log(copyContent)
			
				uni.setClipboardData({
			 	    data: copyContent,
			    	success: function () {
						//调用方法成功
						console.log('copy success');
					}
				})
			}
		}
	}
</script>

<style>
	@import url(../customerservice/customerservice.css);
</style>
