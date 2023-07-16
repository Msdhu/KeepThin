const app = getApp();
const { utils, globalData, ROLES } = app;
const throttle = utils.throttle;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showProduct: !1,
		historyList: [], // 购买历史
		productArray: [], // 产品列表，用于添加
		productIndex: "0",
		selectProList: [],
		isShowAddPop: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		this.data.customerId = opts.customerId;
		this.getHistoryList();
		this.getProList();
	},
	getHistoryList() {
		this.setData({
			historyList: [
				{
					id: 1,
					createTime: "2022-12-15 16:14:22",
					useCount: 2,
					proList: [
						{
							id: 1,
							name: "马杀鸡",
							price: "98",
							num: 10,
						},
					],
				},
				{
					id: 1,
					createTime: "2022-12-15 16:14:22",
					useCount: 2,
					proList: [
						{
							id: 1,
							name: "马杀鸡",
							price: "98",
							num: 10,
						},
					],
				},
				{
					id: 1,
					createTime: "2022-12-15 16:14:22",
					useCount: 2,
					proList: [
						{
							id: 1,
							name: "马杀鸡",
							price: "98",
							num: 10,
						},
					],
				},
				{
					id: 1,
					createTime: "2022-12-15 16:14:22",
					useCount: 2,
					proList: [
						{
							id: 1,
							name: "马杀鸡",
							price: "98",
							num: 10,
						},
					],
				},
			],
		});
	},
	getProList() {
		this.setData({
			productArray: [
				{
					id: 1,
					name: "马杀鸡",
				},
				{
					id: 2,
					name: "跳舞",
				},
				{
					id: 3,
					name: "动感单车",
				},
				{
					id: 4,
					name: "瑜伽",
				},
			],
		});
	},
	handleRevokeHistory(e) {
		const id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "提示",
			content: "是否确认撤销该记录？",
			success: ({ confirm }) => {
				if (confirm) {
					this.getHistoryList();
				}
			},
		});
	},
	// 展开添加弹窗
	showAddPop() {
		this.setData({
			isShowAddPop: true,
		});
	},
	// 关闭添加弹窗
	hideAddPop() {
		this.setData({
			selectProList: [],
			isShowAddPop: false,
		});
	},
	// 选中产品
	handleSelectPro(e) {
		const index = e.detail.value;
		const { productArray, selectProList } = this.data;
		const proItem = productArray[index];
		const hasExit = selectProList.some((item) => item.productId === proItem.id);
		if (hasExit) {
			wx.showToast({
				icon: "none",
				title: "产品选择重复",
			});
			return;
		}
		selectProList.push({
			productId: proItem.id,
			num: 0,
			name: proItem.name,
		});
		this.setData({
			selectProList,
      productIndex: "0",
		});
	},
	handleChangeProNum(e) {
		const index = e.currentTarget.dataset.index;
		const value = e.detail;
		this.setData({
			[`selectProList[${index}].num`]: value,
		});
	},
	handleDelSelect(e) {
		const index = e.currentTarget.dataset.index;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该项目？",
			success: ({ confirm }) => {
				if (confirm) {
					const selectProList = this.data.selectProList;
					selectProList.splice(index, 1);
					this.setData({
						selectProList,
					});
				}
			},
		});
	},
	// 保存添加
	handleSaveAdd() {
		this.getHistoryList();
		this.hideAddPop();
	},
});
