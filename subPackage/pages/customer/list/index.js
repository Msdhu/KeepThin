const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		isShowPhone: true,
		listData: [],
		total: 0,
		// 顶部导航
		searchType: "name",
		// 是否展示筛选
		isShowScreenPop: false,
		// 是否展示日历选择
		isShowCalendar: false,
		// 日历组件选择时间的类型
		calendarType: "",

		/* ---搜索框参数--- */
		// 姓名/电话
		nameOrPhone: "",
		// 成交日期
		dealStartDate: "",
		dealEndDate: "",

		formData: {
			// 到店日期
			arriveStartStoreDate: "",
			arriveEndStoreDate: "",
			// 减重期 (1-巩固期 2-匀减期 3-速减期)
			periodType: "",
			// 今日到店(0-全部 1-已到店 2-未到店)
			arriveStore: "",
			// 未到店天数,
			unArriveDay: "",
			// 是否有产品(1-有产品 2-无产品)
			haveProduct: "",
			// 剩余10斤以内顾客
			remain10Weight: "",
			// 快到期顾客(6个月)
			soonExpired: "",
		},
		topNum: 0,
	},
	onLoad(opts) {
		const formData = this.data.formData;
		const { dealStartDate, dealEndDate, arriveStore } = opts
		arriveStore && (formData.arriveStore = String(arriveStore));

		this.setData({
			dealStartDate,
			dealEndDate,
			formData,
			searchType: dealStartDate ? "date" : "name",
		});
	},
	onShow() {
		this.getListData();
	},
	getParams() {
		const { formData: { arriveStartStoreDate, arriveEndStoreDate, arriveStore, haveProduct, periodType }, nameOrPhone, searchType, dealStartDate, dealEndDate } = this.data;
		const params = {
			// 店铺id
			shop_id: globalData.storeInfo.id,
		};
		if (searchType === "name") {
			nameOrPhone && (params.keyword = nameOrPhone);
		} else if (dealStartDate && dealEndDate) {
			params.sign_date_start = dealStartDate;
			params.sign_date_end = dealEndDate;
		}
		arriveStartStoreDate && (params.arrive_start = arriveStartStoreDate);
		arriveEndStoreDate && (params.arrive_end = arriveEndStoreDate);
		arriveStore && (params.today_arrive = arriveStore);
		haveProduct && (params.product_solution = haveProduct);
		periodType && (params.period_type = periodType);

		return params;
	},
	getListData() {
		utils.request(
			{
				url: `member/list`,
				data: this.getParams(),
				method: "GET",
				success: res => {
					this.setData({
						listData: (res || []).map(item => ({
							id: item?.customer_id,
							// 是否转店 TODO: 修改字段
							transfer: false,
							// 是否到期 TODO: 修改字段
							expired: false,
							// 姓名
							name: item.username,
							// 手机号
							phone: item.phone,
							// 性别
							gender: item.sex || "女",
							// 成交日期
							dealDate: item.sign_date,
							// 到店日期
							arriveStoreDate: item.arrive_date,
							// 初始体重
							originWeight: item.weight_init,
							// 目前体重
							currentWeight: item.weight,
							// 已减斤数     处理后端返回类似数据(3.8000000000000114)的问题
							lossedWeight: (((item.has_reduce || 0) * 10000 + 1) / 10000).toFixed(1),
							// 未减斤数
							unLossWeight: (((item.has_no_reduce || 0) * 10000 + 1) / 10000).toFixed(1),
						})),
						total: (res || []).length,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleSearch() {
		this.getListData();
	},
	inputNameOrPhone: function (ev) {
		this.setData({
			'nameOrPhone': ev.detail.value,
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
			dealStartDate: "",
			dealEndDate: "",
		});
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
		const value = e.detail;
		const { calendarType } = this.data;
		switch (calendarType) {
			case "arriveStore":
				this.setData({
					"formData.arriveStartStoreDate": utils.formatTime(new Date(value[0]), "YYYY-MM-DD"),
					"formData.arriveEndStoreDate": utils.formatTime(new Date(value[1]), "YYYY-MM-DD"),
				});
				break;
			default:
				this.setData({
					dealStartDate: utils.formatTime(new Date(value[0]), "YYYY-MM-DD"),
					dealEndDate: utils.formatTime(new Date(value[1]), "YYYY-MM-DD"),
				});
				break;
		}
		this.hideCalendar()
	},

	// 修改formData
	handleChangeFormData(e) {
		const { type, val } = e.target.dataset;
		this.setData({
			[`formData.${type}`]: String(val),
		});
	},
  handleInptuFormData(e) {
		const { type } = e.currentTarget.dataset;
		this.setData({
			[`formData.${type}`]: e.detail.value,
		});
  },
	handleReset() {
		this.setData({
			formData: {
				arriveStartStoreDate: "",
				arriveEndStoreDate: "",
				periodType: "",
				arriveStore: "",
				unArriveDay: "",
				haveProduct: "",
				remain10Weight: "",
				soonExpired: "",
			},
		});
	},
	handleScreenConfirm() {
		this.getListData();
    this.hideScreen()
	},

	chageShowPhone() {
		this.setData({
			isShowPhone: !this.data.isShowPhone,
		});
	},
	// 查看详情
	goDetail(ev) {
		const { index } = ev.currentTarget.dataset;
		const customerInfo = this.data.listData[index];
		// 用于顾客详情页面的基础数据
		wx.setStorageSync('customerInfo', customerInfo);
		wx.navigateTo({
			url: `/subPackage/pages/customer/detail/index?id=${customerInfo.id}`,
		});
	},
	callPhone(ev) {
		const { phone } = ev.currentTarget.dataset;
		wx.showModal({
			title: "提示",
			content: `是否拨打电话-${phone}`,
			success: ({ confirm }) => {
				if (confirm) {
					wx.makePhoneCall({
						phoneNumber: phone,
					});
				}
			},
		});
	},
	// 导出数据
	handleExportData() {
		const { listData } = this.data;
		if (listData.length > 0) {
			utils.downLoadFile({
				url: 'member/export',
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_ids: listData.map(item => item.id).join(","),
				},
				method: "POST",
			}, `店铺顾客数据汇总`)
		}
	},
});
