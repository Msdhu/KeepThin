const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		isMonthTab: false, // 是否是月份tab
		storeInfo: globalData.storeInfo,
		offsetTop: globalData.marginTop,
		type: 0, // 1: 减重 2： 富婆
		isLoseWeight: false,
		dataList: [],
		nowDate: utils.formatTime(new Date(), "YYYY-MM"),
		startDate: null,
		endDate: null,
		isShowCalendar: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		const type = opts.type;
		this.setData({
			type,
			isLoseWeight: type === 1,
		});
    this.getListData();
	},
	onPageScroll(e) {
		this.setData({
			navColor: utils.getNavColor(e),
		});
	},
	getListData() {
		this.setData({
			dataList: [
				{
					id: 0,
					name: "二凯",
					gender: "女",
					customerId: 1,
					registerCount: 1,
					lossedWeight: 100,
				},
				{
					id: 0,
					name: "二凯",
					gender: "男",
					customerId: 1,
					registerCount: 1,
					lossedWeight: 100,
				},
			],
		});
	},

	// 切换 今日、本月 tab
	selectTab(e) {
		const type = e.currentTarget.dataset.type;
		this.setData({
			isMonthTab: type === "month",
		});
    this.getListData();
	},
	// 查看用户信息
	viewCustomerInfo(e) {
		const customerId = e.currentTarget.dataset.id;
		wx.navgateTo({
			url: `/pages/customer/detail/?id=${customerId}`,
		});
	},
	// 展示时间选择
	showCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	// 关闭时间选择
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
		});
	},
	// 确认时间选择
	handleConfirmCalendar(e) {
		const value = e.detail;

		this.setData({
			startDate: value[0].replace(/\s.*/, ""),
			endDate: value[1].replace(/\s.*/, ""),
		});
    
    this.hideCalendar();
    this.getListData();
		console.log(e);
	},
});
