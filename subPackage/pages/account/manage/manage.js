import Notify from "@vant/weapp/notify/notify";
const app = getApp();
const { utils, globalData, ROLES } = app;
const TAB_TYPES = {
	admin: 0,
	marketing: 1,
	manager: 2,
};
const tabList = [
	{
		name: "总账号(分管)",
		index: TAB_TYPES.admin,
		roles: [ROLES.admin],
	},
	{
		name: "市场部账号",
		index: TAB_TYPES.marketing,
		roles: [ROLES.manager, ROLES.admin],
	},
	{
		name: "店长账号",
		index: TAB_TYPES.manager,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
];
Page({
	data: {
		ROLES,
		showTabList: tabList,
		tabIndex: 0,
		roleType: "",
		isAdmin: false,
		isManager: false,
		isMarketing: false,

		isAdminTab: true,
		isManagerTab: false,
		isMarketingTab: false,

		isShowAddPop: false,
		accountList: [],
		storeList: [],
		checkStores: [],
		formData: {
			realName: "",
			phone: "",
			account: "",
			password: "",
			storeName: "",
			expiredDate: "",
		},
		isEdit: false,
		phoneError: false,
		pageInfo: {
			page: 1,
			limit: 15,
			total: 0,
		},
	},
	onLoad() {
		const userInfo = globalData.userInfo;
		const roleType = userInfo.roleType;

		const isAdmin = roleType === ROLES.admin;
		const isManager = roleType === ROLES.manager;
		const isMarketing = roleType === ROLES.marketing;

		this.setData({
			userInfo,
			roleType,
			isAdmin,
			isManager,
			isMarketing,
			tabsList: tabList.filter((item) => item.roles.includes(roleType)),
		});
		this.getAccountList();
		this.getStoreList();
	},
	initListData() {
		this.initPageInfo();
		this.getAccountList();
	},
	initPageInfo() {
		const pageInfo = this.data.pageInfo;
		pageInfo.page = 1;
		pageInfo.total = 0;
		this.data.accountList.length = 0;
	},
	getAccountList() {
		const { pageInfo, tabIndex, accountList } = this.data;
		const page = pageInfo.page;
		const params = {
			page,
			limit: pageInfo.limit,
			type: tabIndex,
		};
		const resList = [
			{
				realName: "erkai",
				phone: "1231231231231",
				account: "123123123",
				password: "12321312",
				storeName: "阳泉的门店",
			},
			{
				realName: "erkai",
				phone: "1231231231231",
				account: "123",
				password: "12321312",
				storeName: "阳泉的门店",
			},
			{
				realName: "erkai",
				phone: "1231231231231",
				account: "32432",
				password: "12321312",
				storeName: "阳泉的门店",
			},
			{
				realName: "erkai",
				phone: "1231231231231",
				account: "777",
				password: "12321312",
				storeName: "阳泉的门店",
			},
			{
				realName: "erkai",
				phone: "1231231231231",
				account: "666",
				password: "12321312",
				storeName: "阳泉的门店",
			},
		];
		this.setData({
			accountList: accountList.concat(resList),
		});
		pageInfo.total = 1000;
	},
	getStoreList() {
		this.setData({
			storeList: [],
		});
	},
	getTabInfo(tabIndex) {
		return {
			isAdminTab: tabIndex === TAB_TYPES.admin,
			isMarketingTab: tabIndex === TAB_TYPES.marketing,
			isManagerTab: tabIndex === TAB_TYPES.manager,
		};
	},
	tabChangeListener(t) {
		const tabIndex = t.detail;
		this.setData({
			tabIndex,
			...this.getTabInfo(tabIndex),
		});
		this.initListData();
	},
	addAccount() {
		this.setData({
			isEdit: false,
			isShowAddPop: true,
		});
	},
	onClose() {
		this.setData({
			isShowAddPop: false,
		}),
			this.initFormData();
	},
	onChangeCheckbox(t) {
		this.setData({
			checkStores: t.detail,
		});
	},

	initFormData() {
		this.setData({
			formData: {
				isShowAddPop: false,
				checkStores: [],
				user: "",
				phone: "",
				account: "",
				password: "",
				storeName: "",
				edit: false,
				phoneError: false,
				id: "",
				deptId: "",
				expiredDate: "",
			},
		});
	},
	handleEditAccount(e) {
		const index = e.currentTarget.dataset.index;
		const accountInfo = this.data.accountList[index];
		const formData = {
			...accountInfo,
		};
		this.setData({
			formData,
			isEdit: true,
			isShowAddPop: true,
		});
	},
	editStaff(e) {
		var index = e.currentTarget.dataset.index;
		const accountInfo = this.data.accountList[index];
		wx.navigateTo({
			url: `/subPackage/pages/employee/list/list?${utils.obj2query({
				storeId: accountInfo.storeId,
				storeName: accountInfo.storeName,
				name: accountInfo.realName,
			})}`,
		});
	},
	checkData() {
		const data = this.data;
		const { isAdminTab, isManagerTab, isMarketingTab, formData, checkStores } =
			data;
		const requireKeyList = ["realName", "phone", "account", "password"];
		const isCross = requireKeyList.every((key) => !!formData[key]);
		if (isCross) {
			if (isManagerTab && formData.storeName) return true;
			if (isMarketingTab && checkStores.length > 0) return true;
		}
		Notify({
			type: "danger",
			message: "请填写完整账号信息！",
		});
		return false;
	},
	saveAdd() {
		if (!this.checkData()) return;
		const params = {
			...this.data.formData,
		};
		this.initListData();
	},
	updateData() {
		if (!this.checkData()) return;
		const params = {
			...this.data.formData,
		};
		this.initListData();
	},
	deleteAccount(accountInfo) {
		wx.showToast({
			icon: "none",
			title: "删除账号成功",
		});
		this.initListData();
	},
	handleDelAccount(e) {
		const index = e.currentTarget.dataset.index;
		const accountInfo = this.data.accountList[index];
		wx.showModal({
			title: "提示",
			content: "是否确认删除该账号？",
			success: (res) => {
				if (res.confirm) {
					this.deleteAccount(accountInfo);
				} else {
					console.log("用户点击取消");
				}
			},
		});
	},
	phoneBlur() {
		const phone = this.data.formData.phone;
		const isValid = utils.checkPhone(phone);
		this.setData(
			{
				phoneError: !isValid,
			},
			() => {
				if (isValid) {
					this.setData({
						"formData.account": phone,
					});
				}
			}
		);
	},
	selectExpiredDate(e) {
		const formData = this.data.formData;
		formData.expiredDate = e.detail.value;
		this.setData({
			formData,
		});
	},
	onReachBottom: utils.throttle(function () {
		const { accountList, pageInfo } = this.data;
		if (accountList.length >= pageInfo.length) {
			return wx.showToast({
				icon: "none",
				title: "没有更多数据",
			});
		} else {
			pageInfo.page++;
			this.getAccountList();
		}
	}, 100),
});
