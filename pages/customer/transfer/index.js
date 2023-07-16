const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		storeInfo: globalData.storeInfo,
		customerId: "",
		storeList: [],
		transferShop: "",
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		this.data.customerId = opts.customerId;
        this.getStoreList()
	},

	getStoreList() {
		this.setData({
			storeList: [
				{
					id: 1,
					name: "阳泉 康达店",
					isRead: true,
				},
				{
					id: 2,
					name: "测试店铺",
					isRead: true,
				},
				{
					id: 3,
					name: "测试店铺2",
					isRead: false,
				},
				{
					id: 4,
					name: "测试店铺3",
					isRead: true,
				},
			],
		});
	},
	onSelectStore(e) {
		this.setData({
			transferShop: e.detail,
		});
	},
	save() {
		wx.showModal({
			title: "提示",
			content: "是否确认转入该店？",
			success({ confirm }) {
				if (confirm) {
					wx.showToast({
						title: "转店成功!",
						icon: "success",
					});
				}
			},
		});
	},
});
