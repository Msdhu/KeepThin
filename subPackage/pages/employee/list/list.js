const app = getApp();
const { utils, globalData, ROLES } = app;
Page({
	data: {
		page: 1,
		phoneError: false,
		isShowPop: false,
		storeId: "",
		storeName: "",
		name: "",
		formData: {
			user: "",
			phone: "",
			account: "",
			password: "",
		},
	},
	onLoad(opts) {
		this.setData(
			{
				storeId: opts.storeId,
				storeName: opts.storeName,
				name: opts.name,
			},
			() => {
				this.getSubAccounts();
			}
		);
	},
	getSubAccounts() {
		const staffList = [
			{
				user: "erkai",
				phone: "1231231231231",
				account: "123123123",
				password: "12321312",
			},
			{
				user: "erkai",
				phone: "1231231231231",
				account: "123",
				password: "12321312",
			},
			{
				user: "erkai",
				phone: "1231231231231",
				account: "32432",
				password: "12321312",
			},
			{
				user: "erkai",
				phone: "1231231231231",
				account: "777",
				password: "12321312",
			},
			{
				user: "erkai",
				phone: "1231231231231",
				account: "666",
				password: "12321312",
			},
		];
		this.setData({
			staffList,
		});
	},
	showAddStaff() {
		this.setData({
			isShowPop: true,
		});
	},
	onClose() {
		var t = this;
		this.setData(
			{
				isShowPop: false,
			},
			() => {
				t.clearAddStaffForm();
			}
		);
	},
	clearAddStaffForm() {
		this.setData({
			formData: {
				user: "",
				phone: "",
				account: "",
				password: "",
			},
			phoneError: false,
		});
	},
	checkFormData() {
		const formData = this.data.formData;
		const { account, password, phone, user } = formData;
		const isValid = account && password && phone && user;
		if (!isValid) {
			wx.showToast({
				icon: "none",
				title: "请填写完整信息!",
			});
		}
		return isValid;
	},
	saveAddStaff() {
		const data = this.data;
		const formData = data.formData;
		if (this.checkFormData() && !data.phoneError) {
			// save
			const params = {
				...formData,
			};
		}
	},
	handleDelete(t) {
		const index = t.currentTarget.dataset.index;
		const info = this.data.staffList[index];
		wx.showModal({
			title: "提示",
			content: "是否确认删除该账号？",
			success: (t) => {
				if (t.confirm) {
					this.deleteInfo(info);
				} else if (t.cancel) {
					console.log("用户点击取消");
				}
			},
		});
	},

	deleteInfo(info) {
		wx.showToast({
			icon: "none",
			title: "删除成功",
		});
		this.getSubAccounts();
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
});
