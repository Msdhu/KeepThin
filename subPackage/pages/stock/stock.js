import Notify from "@vant/weapp/notify/notify";
const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabsList: [
			{
				name: "产品库存",
				index: 0,
			},
			{
				name: "库存记录",
				index: 1,
			},
		],
		stockList: [], // 产品库存列表
		stockLogList: [], // 库存记录
		saleData: {
			// 销售数据
			customerCount: 0, // 总顾客人数
			totalIncome: 0, // 聊城款总数
		},
		startDate: utils.formatTime(new Date(), "YYYY-MM-DD"), // 开始时间
		endDate: utils.formatTime(new Date(), "YYYY-MM-DD"), // 结束时间
		tabIndex: 0,
		isShowCalendar: false,
		isShowAddPop: false,
		addFormData: {
			goodsName: "",
			price: "",
		},
		isExport: false,
	},
	onLoad() {
		this.getStockList();
		this.getStockLogs();
	},
	getStockList() {
		this.setData({
			stockList: [
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
				{
					id: 1,
					goodsName: "快乐水",
					price: "2",
					stock: 1,
					count: 0,
				},
			],
		});
	},
	getStockLogs() {
		this.setData({
			saleData: {
				customerCount: 20,
				totalIncome: 1000,
			},
			stockLogList: [
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
				{
					id: 1,
					goodsName: "快乐水",
					totalPrice: "900",
					inputStockCount: 1,
					outStockCount: 95,
				},
			],
		});
	},
	tabChangeListener: function (t) {
		this.setData({
			tabIndex: t.detail,
		});
	},
	addData() {
		this.setData({
			isShowAddPop: true,
		});
	},
	handleCloseAddPop() {
		this.setData({
			isShowAddPop: false,
			addFormData: {
				goodsName: "",
				price: "",
			},
		});
	},
	handleAddSave() {
		const formData = this.data.formData;
		if (!formData.goodsName || !formData.price) {
			Notify({
				type: "danger",
				message: "请填写完整商品信息！",
			});
			return;
		}
		this.handleCloseAddPop();
	},
	handleShowCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	handleExport() {
		this.setData({
			isShowCalendar: true,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
			isExport: true,
		});
	},
	handleChangeStock(e) {
		const index = e.currentTarget.dataset.index;
		this.setData({
			[`stockList[${index}].count`]: e.detail,
		});
	},
	handleSave() {
		const stockList = this.data.stockList;
		const isChanged = stockList.some((item) => item.count);
		if (!isChanged) {
			Notify({
				type: "danger",
				message: "请先操作库存！",
			});
			return;
		}
	},
	handleCalendarChange(e) {
		const value = e.detail;
		console.log(e);
		if (this.data.isExport) {
		} else {
			this.setData({
				startDate: value[0].replace(/\s.*/, ""),
				endDate: value[1].replace(/\s.*/, ""),
			});
			this.getStockLogs();
		}
		this.hideCalendar();
	}
});
