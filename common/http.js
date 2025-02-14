const _show_error = (_message = "发生错误") => {
	uni.showToast({
		title: `${_message}`,
		icon: 'none',
		duration: 2000
	})
}
let toast = null;

const HTTP = (url,data = {}, header = {}, method = 'POST') => {
	if(!url){
		_show_error('请求路径错误！！')
		return
	}
	uni.showLoading({
		duration: 50 * 1000, //显示多少时间，默认1500毫秒
		title: '加载中...',//显示的文字
		mask:true,//是否显示透明蒙层，防止触摸穿透，默认：false
		// icon: "success"  //自定义显示的图标，默认成功success，错误error,加载loading，不显示图标是none
	})
	console.log("请求地址:",getApp().globalData.host + url)
	return new Promise((resolve, reject) => {
		uni.request({
			url: getApp().globalData.host + url,
			method: method,
			data: data,
			header: header,
			success: (res) => {
				uni.hideLoading();
				console.log(res)
				if (res.statusCode == 200) {
					if (!res.data?.error) {
						resolve(res)
					} else {
						_show_error( res.data.message)
						reject(res)
					}
				} else {
					_show_error( res.data?.message)
					reject(res)
				}
			},
			fail: (err) => {
				console.log(err)
				_show_error(err.errMsg)
				uni.hideLoading();
				reject(err)
			}
		})
	})
}

export {
	HTTP
}
