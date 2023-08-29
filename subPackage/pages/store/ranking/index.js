const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		// 是否是月份tab
		isMonthTab: false,
		storeInfo: {},
		offsetTop: globalData.marginTop,
		isLoseWeight: true,
		dataList: [],
	},

	onLoad(opts) {
		// 1: 减重 2： 富婆
		const type = Number(opts.type || 1);
		this.setData({
			isLoseWeight: type === 1,
			storeInfo: globalData.storeInfo,
		}, () => {
			this.getListData();
		});
	},
	onPageScroll(e) {
		this.setData({
			navColor: utils.getNavColor(e),
		});
	},
	getListData() {
		// 店铺id
		const { id } = globalData.storeInfo;
		const { isMonthTab, isLoseWeight } = this.data;
		utils.request(
			{
				url: `shop/rank`,
				data: {
					shop_id: id,
					type: isMonthTab ? 'month' : 'day',
				},
				method: "GET",
				success: (res = {}) => {
					const data = (res || []).map(item => ({
						id: item.customer_id,
						name: item.customer_name,
						gender: item.sex,
						registerCount: item.count,
						lossedWeight: item.weight_reduce,
					}));
					this.setData({
						// data 列表是减重的降序，涨称数据则直接倒过来即可
						dataList: isLoseWeight ? data : data.reverse(),
					});
				},
			},
			true
		);
	},
	// 切换 今日、本月 tab
	selectTab(e) {
		const type = e.currentTarget.dataset.type;
		this.setData({
			isMonthTab: type === "month",
		}, () => {
			this.getListData();
		});
	},
	// 查看用户信息
	viewCustomerInfo(ev) {
		const customerId = ev.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/subPackage/pages/customer/detail/index?id=${customerId}`,
		});
	},
});
