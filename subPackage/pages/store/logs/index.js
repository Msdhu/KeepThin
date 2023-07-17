const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		logList: [],
		page: 1,
		total: 10,
	},
	onLoad() {
		this.getLogList();
	},
	onReady() {},
	onShow() {},
	getLogList() {
		this.setData({
			logList: [
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
				{
					content: `
        店铺： 测试店铺
        操作人：凯子
        客户：小二
        产品：阿拉蕾
        事件：库存不足
        时间：2023-07-07 12:12:53
        `,
				},
			],
		});
	},
	onHide() {},
	onUnload() {},
	onPullDownRefresh() {},
	onReachBottom: utils.throttle(function () {
		const { total, page, logList } = this.data;
		if (logList.length > total) {
			wx.showToast({
				icon: "none",
				title: "没有更多数据",
			});
			return;
		} else {
			this.setData({
				page: ++page,
			});
			this.getLogList();
		}
	}, 1000),
	onShareAppMessage() {},
});
