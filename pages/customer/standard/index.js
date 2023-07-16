const app = getApp();
const { utils, globalData, ROLES } = app;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        customerId: '',
        standardInfo: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    
    onLoad(opts) {
        var t = this;
        this.data.customerId = opts.customerId;

        this.getStandardInfo();
    },
    getStandardInfo: function() {
        this.setData({
            standardInfo: {
				id: "",
                store: '二泉店',
				name: "二凯",
                standardDate: '2023-06-10 15:12:21', // 达标日期
				currentWeight: "123", // 今日体重
				originWeight: 161, // 初始体重
				standardWeight: 120, // 标准体重
				regiseterCount: 11, // 累积到店
				realLossedWeight: 11, // 实际减重
			}
        })
    },
})