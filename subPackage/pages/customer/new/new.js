import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData } = app;

const READ_STORAGE_KEY = "readAgreement";
const getDateTxt = dateStr => {
	return utils.formatTime(new Date(dateStr.replace(/-/g, "/")), "YYYY年MM月DD日");
};

Page({
	data: {
		// 是否编辑顾客信息
		isEdit: false,
		// 顾客id
		consumerId: "",
		action: 1,
		// 是否展示顾客来源选择
		isShowSource: false,
		// 顾客来源列表
		sourceActions: [
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
		// 顾客来源
		source: "",
		// 是否显示尺寸选择
		isShowSizePop: false,
		sizeDTOList: [
			{
				name: "脐上",
				size: "",
				flag: "size_js",
			},
			{
				name: "脐中",
				size: "",
				flag: "size_jz",
			},
			{
				name: "脐下",
				size: "",
				flag: "size_jx",
			},
			{
				name: "左臂",
				size: "",
				flag: "size_zb",
			},
			{
				name: "右臂",
				size: "",
				flag: "size_yb",
			},
			{
				name: "左大腿",
				size: "",
				flag: "size_zdt",
			},
			{
				name: "左小腿",
				size: "",
				flag: "size_zxt",
			},
			{
				name: "右大腿",
				size: "",
				flag: "size_ydt",
			},
			{
				name: "右小腿",
				size: "",
				flag: "size_yxt",
			},
		],
		sizeDTOPreList: [],
		// 姓名
		name: "",
		// 手机号
		phone: "",
		// 性别
		gender: "女",
		// 年龄
		age: "",
		// 身高
		height: "",
		// 初始体重
		originWeight: "",
		// 标准体重
		standardWeight: "",
		// 应减体重
		loseWeight: "",
		// 签约日期
		dealDate: "",
		// 签约日期选中原始值
		dealDateOrigin: "",
		// 到期日期
		expireDate: "",
		// 到期日期原始值
		expireDateOrigin: "",
		// 减重期/疗程期
		loseWeightPeriod: 0,
		// 巩固期
		consolidationPeriod: 2,
		// 是否二次成交
		reset: false,
		// 是否转入巩固期
		isConsolidationPeriod: 0,
		// 疗程金额
		courseCost: "",
		// 补缴疗程金额
		remainCost: "",
		currentDate: utils.formatTime(new Date(), "YYYY-MM-DD"),
	},
	onLoad(opts) {
		!wx.getStorageSync(READ_STORAGE_KEY) && this.setData({
			isShowAggrement: true,
		});

		const isEdit = !!opts.type;
		wx.setNavigationBarTitle({
			title: isEdit ? "修改顾客资料" : "新客录入",
		});
		this.setData({
			sizeDTOPreList: this.data.sizeDTOList.map(item => ({ ...item })),
		});
		if (isEdit) {
			this.setData({
				consumerId: opts.consumerId,
				isEdit,
			}, () => {
				this.getConsumerInfo();
			});
		}
	},
	onConsumerSave() {
		// 店铺id
		const { id: shop_id } = app.globalData.storeInfo
		const { isEdit, consumerId, source, sizeDTOList, name, phone, gender, age, height, originWeight, standardWeight, loseWeight, dealDateOrigin, expireDateOrigin, loseWeightPeriod, consolidationPeriod, reset, isConsolidationPeriod, courseCost, remainCost } = this.data;
		if (!(courseCost && dealDateOrigin && expireDateOrigin)) {
			Notify({
				type: "danger",
				message: "请填写完整顾客信息！",
			});
			return;
		}
		const params = {
			shop_id,
			base: {
				phone,
				username: name,
				sex: gender,
				age,
				height,
				weight_init: originWeight,
				weight_normal: standardWeight,
				weight_reduce: loseWeight,
				weight_reduce_period: loseWeightPeriod,
				period_money: courseCost,
				sign_date: dealDateOrigin,
				end_date: expireDateOrigin,
				consoli_date: consolidationPeriod,
				into_consoli_if: isConsolidationPeriod,
				source,
			},
			body: sizeDTOList.reduce((size, item) => {
				size[item.flag] = item.size;
				return size;
			}, {}),
		};
		if (isEdit) {
			// 补缴疗程金额
			params.base.period_money_ext = remainCost;
			// 是否二次成交
			params.base.second_if = reset ? 1 : -1;
			params.customer_id = consumerId;
		}
		utils.request(
			{
				url: isEdit ? "member/edit" : "member/save",
				data: params,
				method: "POST",
				success: () => {
					wx.showToast({
						title: isEdit ? "修改顾客信息成功" : "新增顾客成功",
						icon: "none",
					});
					wx.navigateBack({
						delta: 1
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	getConsumerInfo() {
		const { consumerId, sizeDTOList, sourceActions } = this.data;
		utils.request(
			{
				url: `member/detail`,
				data: {
					customer_id: consumerId,
				},
				method: "GET",
				success: res => {
					const sizeList = sizeDTOList.map(item => ({
						...item,
						'size': res[item.flag],
					}))
					this.setData({
						phone: res.phone,
						name: res.username,
						gender: res.sex || '女',
						age: res.age,
						height: res.height,
						originWeight: res.weight_init,
						standardWeight: res.weight_normal,
						loseWeight: res.weight_reduce,
						loseWeightPeriod: res.weight_reduce_period,
						courseCost: res.period_money,
						dealDateOrigin: res.sign_date,
						dealDate: getDateTxt(res.sign_date),
						expireDateOrigin: res.end_date,
						expireDate: getDateTxt(res.end_date),
						consolidationPeriod: res.consoli_date,
						isConsolidationPeriod: Number(res.into_consoli_if || 0),
						source: sourceActions[res.source || 0]?.name,
						remainCost: res?.period_money_ext || "",
						reset: res?.second_if == 1,
						sizeDTOList: sizeList,
						sizeDTOPreList: sizeList.map(item => ({ ...item })),
					}, () => {
						this.calculationStandardWeight();
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	// 改变性别
	onChangeGender(e) {
		this.setData({
			gender: e.detail,
		}, () => {
			this.calculationStandardWeight();
		});
	},
	// 选择签约日期
	handleSelectDealDate(e) {
		const value = e.detail.value;
		const dealDate = getDateTxt(value);
		this.setData({
			dealDate,
			dealDateOrigin: value,
		});
	},
	// 选择到期时间
	selectExpireDate(e) {
		const value = e.detail.value;
		const expireDate = getDateTxt(value);
		this.setData({
			expireDate,
			expireDateOrigin: value,
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
			sizeDTOPreList: this.data.sizeDTOList,
			isShowSizePop: true,
		});
	},
	onCloseSelectSize() {
		this.setData({
			sizeDTOList: this.data.sizeDTOPreList,
			isShowSizePop: false,
		});
	},
	onChangeSize(e) {
		const index = e.currentTarget.dataset.index;
		const sizeDTOList = this.data.sizeDTOList;
		sizeDTOList[index].size = e.detail;
		this.setData({ sizeDTOList });
	},
	saveSize() {
		this.setData({
			isShowSizePop: false,
		});
	},
	// 计算标准体重
	calculationStandardWeight() {
		const { gender, height, age } = this.data;
		if (gender && height && age) {
			const ageFix = 30 - age;
			const heightFix = gender ===  "男" ? 65 : 70;
			let fix = 0.6 * (height - heightFix) - (gender ===  "男" ? 2 : 3.5);
			if (ageFix < 0) {
				fix += 0.2 * Math.abs(ageFix)
			} else {
				fix -= 0.2 * Math.abs(ageFix)
			}
			this.setData({
				standardWeight: (fix * 2).toFixed(2),
			}, () => {
				this.calculationShouldWeight();
			});
		}
	},
	// 计算应减体重
	calculationShouldWeight() {
		const { originWeight, standardWeight } = this.data;
		if (originWeight && standardWeight) {
			const loseWeight = (originWeight - standardWeight).toFixed(2);
			this.setData({
				loseWeight,
				loseWeightPeriod: Math.ceil(loseWeight / 10),
			});
		}
	},
	checkPreData() {
		const { name, phone, gender, age, height, originWeight } = this.data;
		if (name && phone && gender && age && height && originWeight) return true;
		Notify({
			type: "danger",
			message: "请填写完整顾客信息！",
		});
		return false;
	},
	handleNext() {
		if (!this.checkPreData()) return;
		this.setData({
			action: 2,
		});
	},
	handlePre() {
		this.setData({
			action: 1,
		});
	},
	handleSwitchReset(e) {
		this.setData({
			reset: e.detail,
			isConsolidationPeriod: false,
		});
	},
	handleSwitchIsConsolidationPeriod(e) {
		this.setData({
			isConsolidationPeriod: Number(e.detail),
			reset: false,
		});
	},
	showAggrement() {
		this.setData({
			isShowAggrement: true,
		});
	},
	onCloseAgreement(e) {
		const closeType = e.currentTarget.dataset.type;
		if (closeType === "btn") {
			wx.setStorageSync(READ_STORAGE_KEY, true);
			this.setData({
				isShowAggrement: false,
			});
		} else {
			wx.showToast({
				title: "请完整阅读并同意协议",
				icon: "none",
			});
		}
	},
});
