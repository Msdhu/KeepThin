const app = getApp();
const { globalData, ROLES, utils } = app;
const menuList = [
	{
		color: "#2C9C58",
		title: "新客录入",
		img: "/assets/img/xinkeluru.png",
		url: "/subPackage/pages/customer/new/new",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#A27954",
		title: "店铺管理",
		img: "/assets/img/dianpuguanli.png",
		url: "/subPackage/pages/store/manage/manage",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#2CABF5",
		title: "库存管理",
		img: "/assets/img/kucunguanli.png",
		url: "/subPackage/pages/stock/stock",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
	{
		color: "#A27954",
		title: "员工统计",
		img: "/assets/img/yuangogntongji.png",
		url: "/subPackage/pages/employee/index/index",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
	{
		color: "#CC942C",
		title: "店铺设置",
		img: "/assets/img/dianpushezhi.png",
		url: "/subPackage/pages/store/setting/setting",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#DA7A7C",
		title: "账号管理",
		img: "/assets/img/zhanghaoguanli.png",
		url: "/subPackage/pages/account/manage/manage",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
];

Page({
	data: {
		offsetTop: 0,
		isAdmin: false,
		isMarketing: false,
		showMenuList: menuList,
		// 展示的手机号码
		showPhone: "",
		// 是否显示全部手机号码
		isShowPhone: true,
		// 导航文字颜色
		navigationColor: "#fff",
		// 选中的店铺index
		activeStoreIndex: -1,
		// 登陆用户信息
		userInfo: globalData.userInfo,
		// 店铺信息
		storeInfo: null,
		storeList: [],
		isStorePopShow: false,
		// 城市信息
		cityInfo: null,
		cityList: [],
		provinceList: [],
		// 选中的省份和城市信息
		selectProvince: {},
		selectCity: {},
		isShowCityPop: false,
	},
	onLoad() {
		const { roleType } = globalData.userInfo;
		this.setData({
			offsetTop: globalData.marginTop,
			isAdmin: roleType === ROLES.admin,
			isMarketing: roleType === ROLES.marketing,
			showMenuList: menuList.filter(item => item.roles.includes(roleType)),
		});
		this.getIndexData();
	},
	getIndexData() {
		utils.request(
			{
				url: `com/info`,
				method: "GET",
				success: res => {
					const { data: realRes } = res;
					const { data: indexData, code } = realRes;
					if (code === 100) {
						this.getUserInfo(indexData);
						this.data.isAdmin ? this.getProvinceList(indexData) : this.getCityAndShopInfo(indexData);
					} else {
						wx.showToast({
							title: "网络请求失败，请稍后重试",
							icon: "none",
						});
					}
				},
			},
			true
		);
	},
	getUserInfo(data = {}) {
		const userInfo = {
			...globalData.userInfo,
			phone: data.phone,
			name: data.nickname,
		};
		// 更新 globalData 信息
		app.globalData.userInfo = userInfo;

		this.setData({
			showPhone: data.phone,
			userInfo,
		});
	},
	getProvinceList(data = {}) {
		const provinceInfo = Object.values(data.shops) || [];
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

		this.setData({
			provinceList,
		});
	},
	getCityAndShopInfo(data = {}) {
		const fixShops = Array.isArray(data.shops[0]) ? data.shops[0] : data.shops;
		const storeList = fixShops.map(shop => {
			return {
				id: shop.id,
				name: shop.shop_name,
				isRead: false,
				deviceNo: shop.device_no,
				macAddr: shop.mac_addr,
			};
		});
		const storeInfo = {
			...globalData.storeInfo,
			// 默认选中第一个shop
			...storeList[0],
		};
		// 更新 globalData 信息
		app.globalData.storeInfo = storeInfo;

		const fixCity = Array.isArray(data.citys) ? data.citys[0] : data.citys;
		const selectCity = {
			regid: fixCity.district_id,
			regname: fixCity.district,
		};

		this.setData({
			storeList,
			storeInfo,
			// 默认选中第一个shop
			activeStoreIndex: 0,

			selectCity,
			cityInfo: {
				name: selectCity.regname,
			},
		});
	},

	// 开始选择店铺
	switchStore() {
		this.setData({
			isStorePopShow: true,
			navigationColor: "#515365",
		});
	},
	// 关闭选择店铺
	closeStorePop() {
		this.setData({
			isStorePopShow: false,
			navigationColor: "#fff",
		});
	},
	checkStore(e) {
		const storeIndex = +e.currentTarget.dataset.index;
		const storeInfo = this.data.storeList[storeIndex];
		if (this.data.activeStoreIndex !== storeIndex) {
			this.setData({
				storeInfo,
				activeStoreIndex: storeIndex,
			});
			app.globalData.storeInfo = storeInfo;
		}
		this.closeStorePop();
	},
	showCityPop() {
		this.setData({
			isShowCityPop: true,
		});
	},
	hideCityPop() {
		this.setData({
			isShowCityPop: false,
		});
	},
	onClickProvince(e) {
		const selectProvince = e.currentTarget.dataset.item;
		// 点击同一个省份，则页面无需变化
		if (selectProvince.regid === this.data.selectProvince?.regid) return;

		this.setData({
			selectProvince,
			selectCity: {},
			cityList: selectProvince.cityList,
		});
	},
	onClickCity(e) {
		this.setData({
			selectCity: e.currentTarget.dataset.item,
		});
	},
	handleSaveSelectCity() {
		const { selectProvince, selectCity } = this.data;
		this.setData({
			cityInfo: {
				name: `${selectProvince.regname} ${selectCity.regname}`,
			},
			storeList: (selectCity.shopList || []).map(shop => {
				return {
					id: shop.id,
					name: shop.shop_name,
					isRead: false,
					deviceNo: shop.device_no,
					macAddr: shop.mac_addr,
				};
			}),
			activeStoreIndex: -1,
		});
		this.hideCityPop();
	},

	// 跳转页面
	handleGoto(e) {
		const index = e.currentTarget.dataset.index;
		const menuItem = this.data.showMenuList[index];
		const { url, needStore } = menuItem;
		const storeInfo = this.data.storeInfo;
		if (Object.keys(storeInfo).length > 0 || !needStore) {
			wx.navigateTo({
				url,
			});
		} else {
			wx.showToast({
				icon: "none",
				title: "请先选择店铺",
			});
		}
	},
	handleChangePhoneShow() {
		const isShowPhone = !this.data.isShowPhone;
		const phone = this.data.userInfo.phone;
		const showPhone = isShowPhone ? phone : `${phone.slice(0, 3)}****${phone.slice(-4)}`;
		this.setData({
			isShowPhone,
			showPhone,
		});
	},
});
