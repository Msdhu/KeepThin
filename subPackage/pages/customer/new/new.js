const app = getApp();
const { utils, globalData, ROLES } = app;
const READ_STORAGE_KEY = "readAgreement";
function getDateTxt(dateStr) {
	return utils.formatTime(
		new Date(dateStr.replace(/-/g, "/")), "YYYY年MM月DD日"
	);
}
Page({
	data: {
		action: 1,
		currentDate: utils.formatTime(new Date(), "YYYY-MM-DD"),
		minDate: "2023-07-01",
		isShowSource: false, // 是否展示顾客来源选择
		sourceActions: [
			// 顾客来源列表
			{
				name: "转介绍",
			},
			{
				name: "自然进店",
			},
			{
				name: "宣传单",
			},
			{
				name: "老转新",
			},
		],
		source: "", // 顾客来源
		isShowSizePop: false, // 是否显示尺寸选择
		sizeDTOList: [
			{
				name: "脐上",
				size: "",
			},
			{
				name: "脐中",
				size: "",
			},
			{
				name: "脐下",
				size: "",
			},
			{
				name: "左臂",
				size: "",
			},
			{
				name: "右臂",
				size: "",
			},
			{
				name: "左大腿",
				size: "",
			},
			{
				name: "左小腿",
				size: "",
			},
			{
				name: "右大腿",
				size: "",
			},
			{
				name: "右小腿",
				size: "",
			},
		],

		name: "", // 姓名
		phone: "", // 手机号
		gender: "女", // 性别
		age: 0, // 年龄
		height: 0, // 身高
		originWeight: 0, // 初始体重
		standardWeight: "", // 标准体重
		loseWeight: "", // 应减体重
		dealDate: "", // 签约日期
		dealDates: "", // 签约日期选中原始值
		expireDate: "", // 到期日期
		expireDates: "", // 到期日期原始值
		loseWeightPeriod: 0, // 减重期/疗程期
		consolidationPeriod: 2, // 巩固期
		source: "", // 顾客来源
		reset: false, // 是否二次成交
		isConsolidationPeriod: false, // 是否转入巩固期
		courseCost: 0, // 疗程金额
		remainCost: 0, // 补缴疗程金额
	},
	onLoad(opts) {
		const isRead = wx.getStorageSync(READ_STORAGE_KEY);
		if (!isRead) {
			this.setData({
				isShowAgreement: true,
			});
		}

		const isEdit = opts.type;
		wx.setNavigationBarTitle({
			title: isEdit ? "修改顾客资料" : "新客录入",
		});
		if (isEdit) {
			this.setData(
				{
					updateData: true,
					id: opts.consumerId,
					isEdit: true,
				},
				() => this.getConsumerInfo()
			);
		}
	},
	getConsumerInfo() {
		const resData = {};
		this.setData({
			name: resData.name,
			phone: resData.phone,
			gender: resData.gender,
			age: resData.age,
			height: resData.height,
			originWeight: resData.originWeight,
			standardWeight: resData.standardWeight,
			loseWeight: resData.loseWeight,
			dealDate: resData.dealDate,
			dealDates: resData.dealDates,
			expireDate: resData.expireDate,
			expireDates: resData.expireDates,
			loseWeightPeriod: resData.loseWeightPeriod,
			consolidationPeriod: resData.consolidationPeriod,
			source: resData.source, // 顾客来源
			reset: !resData.reset,
			isConsolidationPeriod: resData.isConsolidationPeriod,
			courseCost: resData.courseCost,
			remainCost: resData.remainCost,
		});
	},
	// 改变性别
	onChangeGender(e) {
		this.setData(
			{
				gender: e.detail,
			},
			() => {
				this.calculateVal();
			}
		);
	},
	// 选择签约日期
	handleSelectDealDate(e) {
		const value = e.detail.value;
		console.log(value);
		console.log(getDateTxt(value))
		const dealDate = getDateTxt(value);
		this.setData({
			dealDate,
			dealDates: value,
		});
	},
	// 选择到期时间
	selectExpireDate(e) {
		const value = e.detail.value;
		const expireDate = getDateTxt(value);
		this.setData({
			expireDate,
			expireDates: value,
		});
	},
	onInput(e) {
		this.setData({
			currentDate: e.detail,
		});
	},
	showSource() {
		this.setData({
			isShowSource: true,
		});
	},
	onCloseSource() {
		this.setData({
			isShowSource: false,
		});
	},
	onSelectSource(e) {
		this.setData({
			source: e.detail.name,
			isShowSource: false,
		});
	},
	showSizePop() {
		this.setData({
			isShowSizePop: true,
		});
	},
	onCloseSelectSize() {
		this.setData({
			isShowSizePop: false,
		});
	},
	onChangeSize(e) {
		var index = e.currentTarget.dataset.index;
		console.log(e);
		const sizeDTOList = this.data.sizeDTOList;
		sizeDTOList[index].size = e.detail;
		this.setData({sizeDTOList});
	},
	saveSize() {
		this.onCloseSelectSize();
	},
	calculateVal() {
		this.calculationStandardWeight();
		this.calculationShouldWeight();
	},
	// 计算标准体重
	calculationStandardWeight() {
		const data = this.data;
		const { gender, height, age } = data;
		if (gender && height && age) {
			this.setData({
				standardWeight: "",
			});
		}
	},
	// 计算应减体重
	calculationShouldWeight() {
		this.setData({
			loseWeight: 0,
			loseWeightPeriod: 0,
		});
	},
	handleNext() {
		this.setData({
			action: 2,
		});
	},
	handlePre() {
		this.setData({
			action: 1,
		});
	},
	save() {
		wx.showToast({
			icon: "none",
			title: "保存成功",
			success: function () {
				wx.navigateBack({
					delta: 1,
				});
			},
		});
	},
	handleSwitchReset(e) {
		this.setData({
			reset: e.detail,
		});
	},
	handleSwitchIsConsolidationPeriod(e) {
		this.setData({
			isConsolidationPeriod: e.detail,
		});
	},
	seeAgreement() {
		this.setData({
			isShowAgreement: true,
		});
	},
	onCloseAgreement(e) {
		const closeType = e.currentTarget.dataset.type;
		if (closeType === "btn") {
			this.setData(
				{
					isShowAgreement: false,
				},
				function () {
					wx.setStorageSync(READ_STORAGE_KEY, true);
				}
			);
		} else {
			wx.showToast({
				icon: "none",
				title: "请完整阅读并同意协议",
			});
		}
	},
});
