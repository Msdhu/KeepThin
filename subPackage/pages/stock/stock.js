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
		isExport: false,
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
						list = Object.keys(res || {}).map(id => ({
							id,
							goodsName: list[id].good_name,
							price: list[id].price,
							stock: list[id].remain,
							addSum: list[id].add_sum,
							delSum: list[id].del_sum,
							// steper 计数
							count: 0,
						}));
					}
					this.setData({
						stockList: list,
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
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(id => ({
							id,
							goodsName: list[id].good_name,
							totalPrice: list[id].price,
							inputStockCount: list[id].add_sum,
							outStockCount: list[id].del_sum,
						}));
					}
					this.setData({
						stockLogList: list,
						// FIXME: 根据后端完成后的接口字段进行修改
						saleData: {
							customerCount: 20,
							totalIncome: 1000,
						},
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

	handleShowCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
			isExport: false,
		});
	},
	handleExport() {
		this.setData({
			isShowCalendar: true,
			isExport: true,
		});
	},
	handleCalendarChange(e) {
		const nowTime = utils.formatTime(new Date(), "YYYY-MM-DD");
		// 边界处理，防止页面报错
		const [start, end] = (Array.isArray(e.detail) ? e.detail : [nowTime, nowTime]).map(time => time.replace(/\s.*/, ""));
		if (this.data.isExport) {
			const { id } = globalData.storeInfo;
			// TODO: 导出数据 url 添加
			utils.downLoadFile('goods/sku-download', {
				shop_id: id,
				date_start: start,
				date_end: end,
			}, `${start}至${end}库存记录`)
		} else {
			this.setData({
				startDate: start,
				endDate: end,
			});
			this.getStockLogs();
		}
		this.hideCalendar();
	},
});
