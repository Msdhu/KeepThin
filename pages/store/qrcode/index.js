const app = getApp();
const { utils, globalData, ROLES } = app;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		qrCodeImg: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},
	onPreviewImage: function () {
		wx.previewImage({
			urls: [this.qrCodeImg],
		});
	},
	generate() {},
});
