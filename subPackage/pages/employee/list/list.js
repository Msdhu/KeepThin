import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		// 页面url查询参数相关字段
		shopId: "",
		shopName: "",
		nickName: "",
		cityId: "",
		
		staffList: [],

		// 新建账号 相关的字段
		name: "",
		phone: "",
		account: "",
		password: "",

		phoneError: false,
		isShowPop: false,
	},
	onLoad(options) {
		this.setData({
			shopId: options.shopId,
			shopName: options.shopName,
			nickName: options.nickName,
			cityId: options.cityId,
		}, () => {
			this.getStaffList();
		});
	},
	getStaffList() {
		utils.request(
			{
				url: "account/dianyuan-list",
				data: {
					shop_id: this.data.shopId,
				},
				method: "GET",
				success: res => {
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(id => ({ ...res[id], id }));
					}
					this.setData({
						staffList: list,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	saveAddStaff() {
		const { phoneError } = this.data;
		if (this.checkData() && !phoneError) {
			const { name, phone, password, shopId, cityId } = this.data;
			utils.request(
				{
					url: "account/add",
					data: {
						nickname: name,
						phone,
						password,
						shop_id: shopId,
						city_id: cityId,
						level: globalData.userInfo.roleType,
					},
					method: "POST",
					success: res => {
						wx.showToast({
							title: "添加账号成功",
							icon: "none",
						});
						this.getStaffList();
						this.onClose();
					},
					isShowLoading: true,
				},
				true
			);
		}
	},
	checkData() {
		const { name, password, phone } = this.data;
		const isValid = name && password && phone;
		if (!isValid) {
			Notify({
				type: "danger",
				message: "请填写完整账号信息！",
			});
		}
		return isValid;
	},
	handleDelete(t) {
		const staffInfo = t.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该账号？",
			success: (t) => {
				if (t.confirm) {
					this.deleteStaff(staffInfo);
				}
			},
		});
	},
	deleteStaff(staffInfo) {
		utils.request(
			{
				url: "account/del",
				data: {
					// FIXME: user_id -> id
					user_id: staffInfo.id,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "删除账号成功",
						icon: "none",
					});
					this.getStaffList();
				},
				isShowLoading: true,
			},
			true
		);
	},

	showAddStaff() {
		this.setData({
			isShowPop: true,
		});
	},
	onClose() {
		this.setData({
			isShowPop: false,
			phoneError: false,
			name: "",
			phone: "",
			account: "",
			password: "",
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
