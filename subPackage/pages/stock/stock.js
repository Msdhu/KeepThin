import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		tabsList: [
			{ name: "产品库存", index: 0 },
			{ name: "库存记录", index: 1 },
		],
		tabIndex: 0,
		// 产品库存列表
		stockList: [],
		// 库存记录
		stockLogList: [],
		// 销售数据
		saleData: {
			// 总顾客人数
			customerCount: 0,
			// 疗程款总数
			totalIncome: 0,
		},

		isShowCalendar: false,
		// 开始时间
		startDate: `${utils.formatTime(new Date(), "YYYY-MM")}-01`,
		 // 结束时间
		endDate: utils.formatTime(new Date(), "YYYY-MM-DD"),

		isShowAddPop: false,
		goodsName: "",
		price: "",
		exportIds: "",
		// 是否有权限新增商品
		canHandle: false,
	},
	onLoad() {
		const { roleType } = globalData.userInfo;
		this.setData({
			canHandle: [ROLES.admin, ROLES.marketing].includes(roleType),
		});
		this.getStockList();
		this.getStockLogs();
	},
	getStockList() {
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `goods/skus`,
				data: {
					shop_id: id,
				},
				method: "GET",
				success: res => {
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(id => ({ ...res[id], id }));
					}
					this.setData({
						stockList: list.map(item => ({
							id: item.id,
							goodsName: item.good_name,
							price: item.price,
							stock: item.remain,
							addSum: item.add_sum,
							delSum: item.del_sum,
							// steper 计数
							count: 0,
						})),
					});
				},
			},
			true
		);
	},
	getStockLogs() {
		// 店铺id
		const { id } = globalData.storeInfo;
		const { startDate, endDate } = this.data;
		utils.request(
			{
				url: `goods/sku-history`,
				data: {
					shop_id: id,
					date_start: startDate,
					date_end: endDate,
				},
				method: "GET",
				success: res => {
					let { list, customers_num: customerCount, totalMoney: totalIncome, customer_id_list: exportIds } = res;
					if (!Array.isArray(list)) {
						list = Object.keys(list || {}).map(id => ({ ...list[id], id }));
					}
					this.setData({
						stockLogList: list.map(item => ({
							id: item.id,
							goodsName: item.good_name,
							totalPrice: item.price,
							inputStockCount: item.add_sum,
							outStockCount: item.del_sum,
						})),
						saleData: {
							customerCount,
							totalIncome,
						},
						exportIds,
					});
				},
			},
			true
		);
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
			goodsName: "",
			price: "",
		});
	},
	deleteStockItem(e) {
		const item = e.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该商品库存信息？",
			success: (t) => {
				if (t.confirm) {
					// 店铺id
					const { id } = globalData.storeInfo;
					utils.request(
						{
							url: `goods/remove`,
							data: {
								shop_id: id,
								good_id: item.id,
							},
							method: "POST",
							success: res => {
								wx.showToast({
									title: "删除商品库存成功",
									icon: "none",
								});
								this.getStockList();
								this.getStockLogs();
							},
							isShowLoading: true,
						},
						true
					);
				}
			},
		});
	},
	handleAddSave() {
		const { goodsName, price } = this.data;
		if (!(goodsName && price)) {
			Notify({
				type: "danger",
				message: "请填写完整商品信息！",
			});
			return;
		}
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `goods/add`,
				data: {
					shop_id: id,
					good_name: goodsName,
					price,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "添加商品成功",
						icon: "none",
					});
					this.handleCloseAddPop();
					this.getStockList();
					this.getStockLogs();
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleChangeStock(e) {
		const index = e.currentTarget.dataset.index;
		this.setData({
			[`stockList[${index}].count`]: Number(e.detail),
		});
	},
	handleSave() {
		const stockList = this.data.stockList;
		const isChanged = stockList.some(item => !!item.count);
		if (!isChanged) {
			Notify({
				type: "danger",
				message: "请先操作库存！",
			});
			return;
		}
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `goods/sku-update`,
				data: {
					shop_id: id,
					list: stockList.filter(item => !!item.count).map(item => ({
						good_id: item.id,
						sku: item.count,
					})),
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "操作库存成功",
						icon: "none",
					});
					this.getStockList();
					this.getStockLogs();
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleExport() {
		const { startDate, endDate } = this.data;
		utils.downLoadFile('goods/export', {
			customer_id_list: this.data.exportIds || '6,7,8',
		}, `${startDate}至${endDate}库存记录`)
	},

	handleShowCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
		});
	},
	handleCalendarChange(e) {
		const nowTime = utils.formatTime(new Date(), "YYYY-MM-DD");
		// 边界处理，防止页面报错
		const [start, end] = (Array.isArray(e.detail) ? e.detail : [nowTime, nowTime]).map(time => time.replace(/\s.*/, ""));

		this.setData({
			startDate: start,
			endDate: end,
		}, () => {
			this.getStockLogs();
		});
		this.hideCalendar();
	},
});
