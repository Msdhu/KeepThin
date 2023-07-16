const app = getApp();
const { utils, globalData, ROLES } = app;
Page({
	data: {
		customerId: "",
		historyList: [], // 购买历史
		isShowEditPop: false,
		editId: "",
		weight: "",
	},
	onLoad(opts) {
		this.data.customerId = opts.customerId;
		this.getHistoryList();
	},
	getHistoryList() {
		this.setData({
			historyList: [
				{
					id: 1,
					createTime: "2023-7-15 15:32:11",
					currentWeight: 100,
				},
				{
					id: 1,
					createTime: "2023-7-15 15:32:11",
					currentWeight: 98,
				},
				{
					id: 1,
					createTime: "2023-7-15 15:32:11",
					currentWeight: 111,
				},
				{
					id: 1,
					createTime: "2023-7-15 15:32:11",
					currentWeight: 2,
				},
				{
					id: 1,
					createTime: "2023-7-15 15:32:11",
					currentWeight: 61,
				},
			],
		});
	},
	showEditPop(t) {
		var id = t.currentTarget.dataset.id;
		this.setData({
			isShowEditPop: true,
			editId: id,
		});
	},
	hideEditPop() {
		this.setData({
			isShowEditPop: false,
			weight: "",
		});
	},
	handleSaveEdit() {
		const { editId, weight, customerId } = this.data;
		this.hideEditPop();
    this.getHistoryList();
	},
	handleDelItem(e) {
		var id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该数据？",
			success: ({ confirm }) => {
				if (confirm) {
					this.getHistoryList();
				}
			},
		});
	},
});
