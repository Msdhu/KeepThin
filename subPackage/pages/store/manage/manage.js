const app = getApp();
const { utils, globalData, ROLES } = app;

const curMonthTxt = utils.formatTime(new Date(), "YYYY-MM");

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userName: globalData.userInfo.name,
		storeName: globalData.storeInfo.name,
		// 展示的手机
		showPhone: globalData.userInfo.phone,
		// 是否显示全手机
		isShowPhone: true,

		todayData: {},
		monthData: {},

		dateMonth: curMonthTxt,
		currentDate: curMonthTxt,
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getShopData();
		this.getMontData();
	},
	getShopData() {
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `shop/index`,
				data: {
					shop_id: id,
				},
				method: "GET",
				success: res => {
					this.setData({
						todayData: {
							// 今日新客
							dayNewCount: res.today_custmer_num || 0,
							// 本月新客
							monthNewCount: res.month_custmer_num || 0,
							// 今日掉称 人数
							lossWeightPersonCount: 80,
							// 今日掉称 斤数
							lossWeightTotal: 100,
							// 今日到店人数
							registerCount: 100,
							// 今日到店应到人数
							realRegisterCount: 100,
							// 今日涨称 人数
							addWeightPersonCount: 10,
							// 今日涨称 斤数
							addWeightTotal: 5,
							// 精护人数
							essensCarePersonCount: 1,
							// 实际减重
							realLossWeightTotal: 2,
							// 平均减重
							avgLossWeight: 1.1,
						},
					});
				},
			},
			true
		);
	},
	getMontData() {
		const monthData = {
			// 本月到店人数
			registerCount: 100,
			// 精护人数
			essensCarePersonCount: 1,
			// 实际减重
			realLossWeightTotal: 2,
			 // 平均减重
			avgLossWeight: 1.1,
			//精护占比
			essensCareWeightRate: 10,
			//掉称占比
			lossWeightRate: 70,
		};
		this.setData({
			monthData,
		});
	},
	// 事件
	handleChangePhoneShow() {
		const isShowPhone = !this.data.isShowPhone;
		const phone = globalData.userInfo.phone;
		const showPhone = isShowPhone
			? phone
			: `${phone.slice(0, 3)}****${phone.slice(-4)}`;
		this.setData({
			isShowPhone,
			showPhone,
		});
	},
	jumpUrl(ev) {
		wx.navigateTo({
			url: ev.currentTarget.dataset.url,
		});
	},
	jumpQuerySearch(e) {
		const type = e.currentTarget.dataset.type;
		if ("today" === type || "month" === type) {
			const endDate = utils.formatTime(new Date(), "YYYY-MM-DD");
			const startDate =
				type === "today" ? endDate : endDate.slice(0, 7) + "-01";
			// 今日新客 和 本月新客
			wx.navigateTo({
				url: `/subPackage/pages/customer/list/index?dealStartDate=${startDate}&dealEndDate=${endDate}`,
			});
		} else {
			// 今日到店
			wx.navigateTo({
				url: "/subPackage/pages/customer/list/index?arriveStore=1",
			});
		}
	},
	onSelectDate(ev) {
		this.setData({
			dateMonth: ev.detail.value,
		}, () => {
			this.getMontData();
		});
	},
	// 详情数据导出
	handleExportData(ev) {
		const { dateMonth } = this.data;
		// TODO: 修改 url 和 params
		utils.downLoadFile('store/export', {
			id: globalData.storeInfo.id, // 店铺id
			date: dateMonth,
		}, `店铺${dateMonth}详细数据`)
	},
	// 导入历史数据
	handleInputHistory() {
		wx.chooseMessageFile({
			count: 1,
			type: "file",
			success: (res) => {
				console.log(res.tempFiles[0], res);
				const { path, size, name } = res.tempFiles[0]
				var e = t.tempFiles[0].path, o = (t.tempFiles[0].size, t.tempFiles[0].name);
				if (name.indexOf(".xlsx") === -1 || name.indexOf(".xls") === -1) {
					wx.showModal({
						title: "提示",
						content: "文件类型必须为excel!(.xls或.xlsx)",
						confirmColor: "#0177ff",
						confirmText: "确定",
					})
				} else {
					wx.showModal({
						title: "提示",
						content: `确定上传${name}?`,
						confirmColor: "#0177ff",
						confirmText: "上传",
						success: (res) => {
							if (res.confirm) {
								wx.showLoading({
									title: "上传中"
								});
								wx.uploadFile({
									// TODO: 修改url 和 formData 参数
									url: ``,
									filePath: path,
									name: "file",
									header: {
										"Content-Type": "multipart/form-data"
									},
									formData: {
										id: globalData.storeInfo.id, // 店铺id
									},
									success: (res) => {
										const e = JSON.parse(res.data);
										wx.hideLoading();
										wx.showModal({
											title: "提示",
											content: e.msg ? e.msg : (200 === e.code ? "文件上传成功" : "文件上传失败"),
											showCancel: false,
										});
									},
									fail: (t) => {
										wx.hideLoading()
										wx.showModal({
											title: "提示",
											content: "文件上传失败" + t.msg,
											showCancel: false,
										});
									}
								});
							}
						}
					});
				}
			}
		});
	},

	onPageScroll(ev) {
		this.setData({
			navColor: utils.getNavColor(ev),
		});
	},
});
