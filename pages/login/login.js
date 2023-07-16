import Notify from "@vant/weapp/notify/notify";
Page({
	data: {
		account: "",
		password: "",
	},
	onLoad(options) {},
	onShow() {},
	onShareAppMessage() {},

	bindInput(e) {
		const type = e.target.dataset.type;
		const val = e.detail.value;
		this.setData({
			[type]: val,
		});
	},
	login: function () {
		const { account, password } = this.data;
		if (!(account && password)) {
			Notify({
				type: "danger",
				message: "请您填写完整的账号或密码",
			});
			return;
		}
		wx.redirectTo({
			url: "../index/index",
		});
	},
});
