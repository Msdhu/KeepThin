import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils } = app;

Page({
	data: {
		account: "",
		password: "",
	},
	bindInput(e) {
		const { type } = e.target.dataset;
		const { value } = e.detail;
		this.setData({
			[type]: value,
		});
	},
	formSubmit: function () {
		const { account, password } = this.data;
		if (!(account && password)) {
			Notify({
				type: "danger",
				message: "请您填写完整的账号或密码",
			});
			return;
		}
		utils.request({
			url: `com/login`,
			data: {
				username: account,
				password,
			},
			method: "POST",
			success: (loginInfo) => {
				// 保存本次登陆时的 loginInfo
				wx.setStorageSync("loginInfo", loginInfo);
				// 保存本次登陆时的时间戳
				wx.setStorageSync("loginTime", new Date().getTime());

				app.globalData.userInfo = {
					...app.globalData.userInfo,
					// 更新用户类型
					roleType: Number(loginInfo.level),
				}
				wx.redirectTo({
					url: "/pages/index/index",
				});
			},
		});
	},
});
