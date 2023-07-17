const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		isLoading: false,
		isShowPhone: true,
		total: 0,
		page: 1,
		limit: 15,
		listData: [],
		searchType: "name", // 顶部导航
		isShowScreenPop: false, // 是否展示筛选
		isShowCalendar: false, // 是否展示日历选择
		calendarType: "", // 日历组件选择时间的类型

		formData: {
			nameOrPhone: "",
			dealStartDate: "",
			dealEndDate: "",

			arriveStartStoreDate: "",
			arriveEndStoreDate: "",
			standarded: "", // 减重期
			arriveStore: "", // 今日到店
			unArriveDay: "", // 未到店天数,
			haveProduct: "", // 是否有产品
			remain10Weight: "", // 剩余10斤以内顾客
			soonExpired: "", // 快到期顾客（6个月
		},
		searchParams: null,
		topNum: 0,
	},
	onLoad(opts) {
		const formData = this.data.formData;
		Object.keys(opts).forEach((key) => {
			if (key in formData) {
				formData[key] = opts[key];
			}
		});
		this.setData({
			formData,
			searchParams: formData,
		});
		this.getListData();
	},
	chageShowPhone() {
		this.setData({
			isShowPhone: !this.data.isShowPhone,
		});
	},
	getListData() {
		this.data.isLoading = true;
		this.setData({
			listData: [
				{
					id: 0,
					transfer: false, // 是否转店
					expired: false, // 是否到期
					name: "小龙", // 姓名
					phone: "18500225772", // 手机号
					gender: 0, // 性别 0 女 1 男
					dealDate: "2013-05-15 8:12:10", // 成交日期
					arriveStoreDate: "2013-05-15 8:12:10", // 到店日期
					originWeight: 130, // 初始体重
					currentWeight: 120, // 目前体重
					lossedWeight: 10, // 已减斤数
					unLossWeight: 5, // 未减斤数
				},
				{
					id: 0,
					transfer: false, // 是否转店
					expired: false, // 是否到期
					name: "小龙", // 姓名
					phone: "18500225772", // 手机号
					gender: 1, // 性别 0 女 1 男
					dealDate: "2013-05-15 8:12:10", // 成交日期
					arriveStoreDate: "2013-05-15 8:12:10", // 到店日期
					originWeight: 130, // 初始体重
					currentWeight: 120, // 目前体重
					lossedWeight: 10, // 已减斤数
					unLossWeight: 5, // 未减斤数
				},
				{
					id: 0,
					transfer: false, // 是否转店
					expired: false, // 是否到期
					name: "小龙", // 姓名
					phone: "18500225772", // 手机号
					gender: 0, // 性别 0 女 1 男
					dealDate: "2013-05-15 8:12:10", // 成交日期
					arriveStoreDate: "2013-05-15 8:12:10", // 到店日期
					originWeight: 130, // 初始体重
					currentWeight: 120, // 目前体重
					lossedWeight: 10, // 已减斤数
					unLossWeight: 5, // 未减斤数
				},
				{
					id: 0,
					transfer: false, // 是否转店
					expired: false, // 是否到期
					name: "小龙", // 姓名
					phone: "18500225772", // 手机号
					gender: 1, // 性别 0 女 1 男
					dealDate: "2013-05-15 8:12:10", // 成交日期
					arriveStoreDate: "2013-05-15 8:12:10", // 到店日期
					originWeight: 130, // 初始体重
					currentWeight: 120, // 目前体重
					lossedWeight: 10, // 已减斤数
					unLossWeight: 5, // 未减斤数
				},
			],
			total: 4,
		});

		this.data.isLoading = false;
	},
	handleGetMore: utils.throttle(function () {
		const { isLoading, listData, total } = this.data;
		if (isLoading) return;
		if (listData.length >= total) {
			wx.showToast({
				icon: "none",
				title: "没有更多数据了",
			});
			return;
		}
		this.data.page++;
		this.getListData();
	}, 1000),

	inputNameOrPhone: function (e) {
		this.setData({
			'formData.nameOrPhone': e.detail.value,
		});
	},
	handleChangeSearchType() {
		const curSearchType = this.data.searchType;
		this.setData({
			searchType: curSearchType === "name" ? "date" : "name",
		});
	},
	handleClearDate() {
		this.setData({
			"formData.dealStartDate": "",
			"formData.dealEndDate": "",
		});
	},
	handleSearch() {
		this.data.searchParams = { ...this.data.formData };
		this.getListData();
	},

	showScreen() {
		this.setData({
			isShowScreenPop: true,
		});
	},
	hideScreen() {
		this.setData({
			isShowScreenPop: false,
		});
	},

	showCalendar(e) {
		const type = e.currentTarget.dataset.type;
		this.setData({
			isShowCalendar: true,
			calendarType: type,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
		});
	},
	handleConfirmCalendar(e) {
		const value = e.detial;
		const { calendarType } = this.data;
		switch (calendarType) {
			case "arriveStore":
				this.setData({
					"formData.arriveStartStoreDate": value[0],
					"formData.arriveEndStoreDate": value[1],
				});
				break;
			default:
				this.setData({
					"formData.dealStartDate": value[0],
					"formData.dealEndDate": value[1],
				});
				break;
		}
	},
	// 修改formData
	handleChangeFormData(e) {
		const dataset = e.target.dataset;
		const key = dataset.type;
		const value = dataset.val;
    console.log(key, value, e,dataset)
		this.setData({
			[`formData.${key}`]: value,
		});
	},
  handleInptuFormData(e) {
		const dataset = e.currentTarget.dataset;
		const key = dataset.type;
		this.setData({
			[`formData.${key}`]: e.detail.value,
		});
  },
	handleReset() {
		this.setData({
			formData: {
				nameOrPhone: "",
				dealStartDate: "",
				dealEndDate: "",

				arriveStartStoreDate: "",
				arriveEndStoreDate: "",
				standarded: "", // 减重期
				arriveStore: "", // 今日到店
				unArriveDay: "", // 未到店天数,
				havProduct: "", // 是否有产品
				remain10Weight: "", // 剩余10斤以内顾客
				soonExpired: "", // 快到期顾客（6个月
			},
		});
	},
	handleScreenConfirm() {
		this.data.searchParams = { ...this.data.formData };
		this.getListData();
    this.hideScreen()
	},
	// 查看详情
	goDetail(e) {
		const index = e.currentTarget.dataset.index;
		wx.navigateTo({
			url: `/subPackage/pages/customer/detail/index?id=${this.data.listData[index].id}`,
		});
	},
	callPhone(e) {
		const phone = e.currentTarget.dataset.phone;
		wx.showModal({
			title: "提示",
			content: `是否拨打电话-${phone}`,
			success: function ({ confirm }) {
				if (confirm) {
					wx.makePhoneCall({
						phoneNumber: phone,
					});
				}
			},
		});
	},
	// 导出数据
	handleExportData() {},
});
