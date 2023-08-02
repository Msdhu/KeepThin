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
		roles: [ROLES.admin, ROLES.marketing],
	},
	{
		name: "店长账号",
		index: TAB_TYPES.manager,
		roles: [ROLES.admin, ROLES.marketing, ROLES.manager],
	},
];

Page({
	data: {
		cityId: "",

		showTabList: [],
		tabIndex: 0,
		isAdmin: false,
		isMarketing: false,
		isManager: false,
		isAdminTab: false,
		isMarketingTab: false,
		isManagerTab: false,

		isShowAddPop: false,
		accountInfo: {},
		accountList: [],

		// 新建账号和编辑账号 相关的字段
		name: "",
		phone: "",
		account: "",
		password: "",
		shopName: "",
		shopList: [],
		checkShops: [],

		isEdit: false,
		editId: "",
		phoneError: false,
	},
	onLoad(options) {
		const { roleType } = globalData.userInfo;
		const isAdmin = roleType === ROLES.admin;
		const isMarketing = roleType === ROLES.marketing;
		const isManager = roleType === ROLES.manager;
		const tabsList = tabList.filter((item) => item.roles.includes(roleType))

		this.setData({
			cityId: options.cityId,
			isAdmin,
			isMarketing,
			isManager,
			isAdminTab: isAdmin,
			isMarketingTab: isMarketing,
			isManagerTab: isManager,
			showTabList: tabsList,
			tabIndex: tabsList[0].index,
		}, () => { this.getAccountList() });
	},
	getAccountList() {
		const { isAdminTab, isMarketingTab, isManagerTab, cityId } = this.data;

		(isMarketingTab || isManagerTab) && utils.request(
			{
				url: isMarketingTab ? "account/shichang-list" : "account/dianzhang-list",
				data: {
					city_id: cityId,
				},
				method: "GET",
				success: res => {
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(id => ({ ...res[id], id }));
					}
					this.setData({
						accountList: list,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},

	tabChangeListener(ev) {
		const tabIndex = ev.detail;
		this.setData({
			tabIndex,
			...this.getTabInfo(tabIndex),
		});
		this.getAccountList();
	},
	getTabInfo(tabIndex) {
		return {
			isAdminTab: tabIndex === TAB_TYPES.admin,
			isMarketingTab: tabIndex === TAB_TYPES.marketing,
			isManagerTab: tabIndex === TAB_TYPES.manager,
		};
	},

	editStaff(ev) {
		const accountInfo = ev.currentTarget.dataset.item;
		wx.navigateTo({
			url: `/subPackage/pages/employee/list/list?${utils.obj2query({
				shopId: accountInfo.shop_id,
				shopName: accountInfo.shop_name,
				nickName: accountInfo.nickname,
				cityId: this.data.cityId,
			})}`,
		});
	},
	handleEditAccount(ev) {
		const accountInfo = ev.currentTarget.dataset.item;
		// 获取 账号详情
		utils.request(
			{
				url: "account/detail",
				data: {
					// FIXME: user_id -> id
					user_id: accountInfo.id,
				},
				method: "GET",
				success: res => {
					this.setData({
						isEdit: true,
						editId: accountInfo.id,
						isShowAddPop: true,

						name: res.nickname,
						phone: res.phone,
						account: res.phone,
						password: res.password,
						shopName: res?.shops[0]?.shop_name || "",
						shopList: (res?.all_shops || []).map(item => ({ ...item, shop_id: String(item.shop_id) })),
						// FIXME: checkShops 修改
						checkShops: (res?.all_shops || []).map(item => String(item.shop_id)),
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleDelAccount(ev) {
		const accountInfo = ev.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该账号？",
			success: res => {
				if (res.confirm) {
					this.deleteAccount(accountInfo);
				}
			},
		});
	},
	deleteAccount(accountInfo) {
		utils.request(
			{
				url: "account/del",
				data: {
					// FIXME: user_id -> id
					user_id: accountInfo.id,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "删除账号成功",
						icon: "none",
					});
					this.getAccountList();
				},
				isShowLoading: true,
			},
			true
		);
	},
	// 新建
	handleSave() {
		if (!this.checkData()) return;
		const { isManagerTab, isMarketingTab, checkShops, name, phone, password, cityId, shopName } = this.data;
		const params = {
			nickname: name,
			phone,
			password,
			city_id: cityId,
			level: globalData.userInfo.roleType,
		};
		if (isManagerTab) {
			// FIXME: shop_name 查询参数待重命名
			params.shop_name = shopName;
		}
		if (isMarketingTab) {
			params.shop_id = checkShops.join(',');
		}
		utils.request(
			{
				url: "account/add",
				data: params,
				method: "POST",
				success: res => {
					wx.showToast({
						title: "添加账号成功",
						icon: "none",
					});
					this.getAccountList();
					this.onClose();
				},
				isShowLoading: true,
			},
			true
		);
	},
	// 编辑
	handleUpdate() {
		if (!this.checkData()) return;
		const { isManagerTab, isMarketingTab, checkShops, name, phone, password, cityId, shopName, editId } = this.data;
		const params = {
			// FIXME: user_id -> id
			user_id: editId,
			nickname: name,
			phone,
			password,
		};
		if (isManagerTab) {
			// FIXME: shop_name 查询参数待重命名
			params.shop_name = shopName;
		}
		if (isMarketingTab) {
			params.shop_id = checkShops.join(',');
		}
		utils.request(
			{
				url: "account/modify",
				data: params,
				method: "POST",
				success: res => {
					wx.showToast({
						title: "编辑账号成功",
						icon: "none",
					});
					this.getAccountList();
					this.onClose();
				},
				isShowLoading: true,
			},
			true
		);
	},
	checkData() {
		const { isManagerTab, isMarketingTab, checkShops, name, phone, password, shopName } = this.data;
		if (name && phone && password) {
			if (isMarketingTab && checkShops.length > 0) return true;
			if (isManagerTab && shopName) return true;
		}
		Notify({
			type: "danger",
			message: "请填写完整账号信息！",
		});
		return false;
	},

	handleAddBtnClick() {
		this.setData({
			isEdit: false,
			isShowAddPop: true,
		});
	},
	onClose() {
		this.setData({
			isShowAddPop: false,
			isEdit: false,
			shopList: [],
			checkShops: [],
			phoneError: false,
			name: "",
			phone: "",
			password: "",
			shopName: "",
		});
	},
	onChangeCheckbox(ev) {
		this.setData({
			checkShops: ev.detail,
		});
	},
	// 电话号码校验
	phoneBlur() {
		const phone = this.data.phone;
		const isValid = utils.checkPhone(phone);
		this.setData({
			phoneError: !isValid,
		}, () => {
			if (isValid) {
				this.setData({
					account: phone,
				});
			}
		});
	},
});
