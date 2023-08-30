import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData, ROLES, cityData } = app;

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
		cityName: "",

		multiIndex: [0, 0],
		multiArray: [
			cityData,
			cityData[0].cityList,
		],
		// 新建店长账号(即新建店铺)时，用于店铺绑定城市
		selectCity: {},

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
	onLoad({ cityId, cityName }) {
		const { roleType } = globalData.userInfo;
		const isAdmin = roleType === ROLES.admin;
		const isMarketing = roleType === ROLES.marketing;
		const isManager = roleType === ROLES.manager;
		const tabsList = tabList.filter((item) => item.roles.includes(roleType))

		this.setData({
			cityId: cityId,
			cityName: cityName,
			selectCity: {
				regid: cityId,
				regname: cityName,
			},
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
		const { userInfo: { phone, name, password } } = globalData;

		this.setData({ accountList: [] });
		
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

		isAdminTab && this.setData({
			accountList: [{
				nickname: name,
				phone,
				account: phone,
				password_show: password,
			}],
		});
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
					id: accountInfo.id,
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
						password: res?.password_show || res.password,
						shopName: res?.shops[0]?.shop_name || "",
						shopList: (res?.all_shops || []).map(item => ({ ...item, shop_id: String(item.shop_id) })),
						checkShops: (res?.shops || []).map(item => String(item.shop_id)),
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
					id: accountInfo.id,
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
		const { isManagerTab, isMarketingTab, checkShops, name, phone, password, cityId, shopName, selectCity } = this.data;
		const params = {
			nickname: name,
			phone,
			password,
			city_id: cityId,
			// 新建账号对应的level, 不是登陆账号的level
			level: isManagerTab ? ROLES.manager : ROLES.marketing,
		};
		if (isManagerTab) {
			params.shop_name = shopName;
			// 新建店长账号时的 city_id 取 selectCity.regid
			params.city_id = selectCity.regid;
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
		const { isManagerTab, isMarketingTab, checkShops, name, phone, password, shopName, editId } = this.data;
		const params = {
			id: editId,
			nickname: name,
			phone,
			password,
		};
		if (isManagerTab) {
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
		if (this.data.isMarketingTab) {
			// 通过调取 info 接口, 获取更新后的 provinceList 数据
			utils.request(
				{
					url: `com/info`,
					method: "GET",
					success: res => {
						const provinceInfo = Object.values(res.shops) || [];
						const provinceList = provinceInfo.map(item => {
							return {
								regid: item.district_id,
								regname: item.district,
								cityList: (item.citys || []).map(city => {
									return {
										regid: city.district_id,
										regname: city.district,
										shopList: city.shops,
									};
								}),
							};
						});
						// 更新 globalData.provinceList
						app.globalData.provinceList = provinceList;

						let shopList = [];
						// 添加市场部账号时，需要绑定相应的店铺
						for(let i = 0; i < provinceList.length; i++) {
							const item = provinceList[i];
							const [city = {}] = item.cityList.filter(city => String(city.regid) === String(this.data.cityId));
							shopList = (city?.shopList || []).map(item => ({ shop_name: item.shop_name, shop_id: String(item.id) }));

							if (shopList.length > 0) break;
						}

						this.setData({
							shopList,
						});
					},
					isShowLoading: true,
				},
				true
			);
		}
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
			account: "",
			password: "",
			shopName: "",

			// 设置为选择的默认城市
			selectCity: {
				regid: this.data.cityId,
				regname: this.data.cityName,
			},
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

	addCity() {
		const { multiIndex, multiArray } = this.data;
		const { regid, regname } = multiArray[1][multiIndex[1]];
		this.setData({
			selectCity: { regid, regname },
		});
	},
	bindMultiPickerChange(ev) {
		const multiIndex = ev.detail.value;
		this.setData({
			multiIndex,
		}, () => {
			this.addCity();
		});
	},
	bindMultiPickerColumnChange(ev) {
		const { column, value } = ev.detail;
		switch (column) {
			case 0:
				this.setData({
					"multiArray[1]": cityData[value].cityList,
					multiIndex: [value, 0],
				});
		}
	},
});
