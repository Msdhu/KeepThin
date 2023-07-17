const app = getApp();
const { utils, globalData, ROLES } = app;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		customerId: "",
		sizeList: [],
		historySizeList: [],
		isShowHistorySize: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		this.data.customerId = opts.customerId;
		this.getSizeList();
		this.getHistoryList();
	},
	getHistoryList() {
		this.setData({
			historySizeList: [
				{
					createTime: "2012-12-04 23:22:11",
					list: [
						{
							name: "脐上",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "脐中",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "脐下",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "左臂",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "右臂",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "左大腿",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "左小腿",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "右大腿",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
						{
							name: "右小腿",
							originSize: "32",
							size: "11",
							diffSize: "22",
						},
					],
				},
			],
		});
	},
	getSizeList() {
		this.setData({
			sizeList: [
				{
					name: "脐上",
					originSize: "32",
					size: "",
				},
				{
					name: "脐中",
					originSize: "32",
					size: "",
				},
				{
					name: "脐下",
					originSize: "32",
					size: "",
				},
				{
					name: "左臂",
					originSize: "32",
					size: "",
				},
				{
					name: "右臂",
					originSize: "32",
					size: "",
				},
				{
					name: "左大腿",
					originSize: "32",
					size: "",
				},
				{
					name: "左小腿",
					originSize: "32",
					size: "",
				},
				{
					name: "右大腿",
					originSize: "32",
					size: "",
				},
				{
					name: "右小腿",
					originSize: "32",
					size: "",
				},
			],
		});
	},
	handleChangeSize(t) {
		const value = t.detail.value;
		const index = t.currentTarget.dataset.index;
		const sizeList = this.data.sizeList;
		sizeList[index].size = value;
		this.setData([sizeList]);
	},
	// 保存修改
	handleSave() {},
	showHistorySize() {
		this.setData({
			isShowHistorySize: true,
		});
	},
	onCloseHistorySize() {
		this.setData({
			isShowHistorySize: false,
		});
	},
	deleteHistorySize(t) {
		var item = t.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该历史尺寸？",
			success: ({ confirm }) => {
				if (confirm) {
					this.getHistoryList();
				}
			},
		});
	},
});
