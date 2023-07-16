const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		tabsList: [
			{
				name: "身体部位",
				index: 0,
			},
			{
				name: "服务人员",
				index: 1,
			},
			{
				name: "其他",
				index: 2,
			},
		],
		tabIndex: 0,
		serviceList: [],
		staffList: [],
		isEdit: false,
		formData: {
			value: "",
		},
		isShowAddPop: false,
		type: "",
	},
	onLoad() {
		this.getServiceList();
		this.getStaffList();
	},
	tabChangeListener: function (t) {
		this.setData({
			tabIndex: t.detail,
		});
	},
	getServiceList() {
		this.setData({
			serviceList: [
				{
					id: 1,
					name: "小腿",
				},
				{
					id: 2,
					name: "面部",
				},
				{
					id: 3,
					name: "大腿",
				},
				{
					id: 4,
					name: "腹部",
				},
				{
					id: 5,
					name: "肚子",
				},
				{
					id: 6,
					name: "胳膊",
				},
			],
		});
	},
	getStaffList() {
		this.setData({
			staffList: [
				{
					id: 1,
					name: "张三",
				},
				{
					id: 2,
					name: "李四",
				},
				{
					id: 3,
					name: "王五",
				},
				{
					id: 4,
					name: "赵构",
				},
				{
					id: 5,
					name: "孙乾",
				},
				{
					id: 6,
					name: "凯尔",
				},
			],
		});
	},
	handleEdit() {
		this.setData({
			isEdit: true,
		});
	},
	handleSave() {
		const { tabIndex } = this.data;
		if (tabIndex == 0) {
			this.saveService();
		}
		if (tabIndex == 1) {
			this.saveStaff();
		}
		this.setData({
			isEdit: false,
		});
	},
	// 保存身体部位编辑结果
	saveService() {},
	// 保存服务人员编辑结果
	saveStaff() {},

	// 提升服务项目排序
	handleTopService() {
		if (!this.data.isEdit) return;
	},

	handleDelete(e) {
		const index = e.currentTarget.dataset.index;
		wx.showModal({
			title: "提示",
			content: "是否确认删除？",
			success: (t) => {
				if (t.confirm) {
					const { tabIndex, staffList, serviceList } = this.data;
					if (tabIndex == 0) {
						this.deleteService(serviceList[index]);
					}
					if (tabIndex == 1) {
						this.deleteStaff(staffList[index]);
					}
				}
			},
		});
	},
	deleteService(item) {},
	deleteStaff(item) {},

	openAdd() {
		this.setData({
			isShowAddPop: true,
		});
	},
	handleCloseAddPop() {
		this.setData({
			formData: {
				value: "",
			},
			isShowAddPop: false,
		});
	},
	handleAddSave() {
		const { formData, tabIndex } = this.data;
		if (!formData.value) {
			Notify({
				type: "danger",
				message: "请填写完整信息！",
			});
			return;
		} else {
			if (tabIndex == 0) {
				this.addService();
			}
			if (tabIndex == 1) {
				this.addStaff();
			}
		}
		this.handleCloseAddPop();
	},

	// 添加身体部位
	addService() {},
	// 添加服务人员
	addStaff() {},
	handleGoto(e) {
		const url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url,
		});
	},
});
