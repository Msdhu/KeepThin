const app = getApp();
const { utils, globalData, ROLES } = app;

const curMonthTxt = utils.formatTime(new Date(), "YYYY-MM");

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: globalData.userInfo,
		storeInfo: globalData.storeInfo,
		showPhone: "", // 展示的手机
		isShowPhone: true, // 是否显示全手机
		todayData: {},
		curMonthData: {},
		monthData: {},
		dateMonth: curMonthTxt,
		currentDate: curMonthTxt,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		const userInfo = globalData.userInfo;
		this.setData({
			showPhone: userInfo.phone,
		});
		this.getTodayDate();
		this.getMontData();
	},
	onShow() {},
	onPageScroll(e) {
		this.setData({
			navColor: utils.getNavColor(e),
		});
	},
	getTodayDate() {
		this.setData({
			todayData: {
				newCustomerCount: 1, // 今日新客
				lossWeightPersonCount: 80, // 今日掉称 人数
				lossWeightTotal: 100, // 今日掉称斤数
				registerCount: 100, // 今日到店人数
				realRegisterCount: 100, // 今日到店应到人数
				addWeightPersonCount: 10, // 今日涨称人数
				addWeightTotal: 5, // 今日涨称 斤
				essensCarePersonCount: 1, // 精护人数
				realLossWeightTotal: 2, // 实际减重
				avgLossWeight: 1.1, // 平均减重
			},
		});
	},
	getMontData() {
		const dateMonth = this.data.dateMonth;
		const monthData = {
			newCustomerCount: 1, // 本月新客
			lossWeightPersonCount: 80, // 本月掉称 人数
			lossWeightTotal: 100, // 本月掉称斤数
			registerCount: 100, // 本月到店人数
			realRegisterCount: 100, // 本月到店应到人数
			addWeightPersonCount: 10, // 本月涨称人数
			addWeightTotal: 5, // 本月涨称 斤
			essensCarePersonCount: 1, // 精护人数
			realLossWeightTotal: 2, // 实际减重
			avgLossWeight: 1.1, // 平均减重
			essensCareWeightRate: 10, //精护占比
			lossWeightRate: 70, //掉称占比
		};
		const curMonthData =
			dateMonth === curMonthTxt ? monthData : this.data.curMonthData;
		this.setData({
			monthData,
			curMonthData,
		});
	},

	// 事件
	handleChangePhoneShow() {
		const isShowPhone = !this.data.isShowPhone;
		const phone = this.data.userInfo.phone;
		const showPhone = isShowPhone
			? phone
			: `${phone.slice(0, 3)}****${phone.slice(-4)}`;
		this.setData({
			isShowPhone,
			showPhone,
		});
	},
	jumpUrl(t) {
		wx.navigateTo({
			url: t.currentTarget.dataset.url,
		});
	},
	jumpQuerySearch(e) {
		const type = e.currentTarget.dataset.type;
		if ("today" === type || "month" === type) {
			const endDate = utils.formatTime(new Date(), "YYYY-MM-DD");
			const startDate =
				type === "today" ? endDate : endDate.slice(0, 7) + "-01";
			wx.navigateTo({
				url: `/subPackage/pages/customer/list/index?dealStartDate=${startDate}&dealEndDate=${endDate}`,
			});
		} else
			wx.navigateTo({
				url: "/subPackage/pages/customer/list/index?arriveStore=2",
			});
	},
	onSelectDate(t) {
		const val = t.detail.value;
		this.setData(
			{
				dateMonth: val,
			},
			() => {
				this.getMontData();
			}
		);
	},
	// 详情数据导出
	handleExportData(t) {
		const exporDate = t.detail.value;
		wx.showToast({
			icon: "none",
			title: `导出${exporDate}数据成功`,
		});
	},
	// 导入历史数据
	handleInputHistory() {},
});
