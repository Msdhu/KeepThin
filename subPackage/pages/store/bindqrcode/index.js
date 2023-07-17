// pages/queryshop/qcode/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrCodeImg: "",
        localImgUrl: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var e = this.data.localImgUrl;
        if (e) {
            var a = wx.getFileSystemManager();
            a.unlinkSync(e), a.closeSync();
        }
    },
    onPreviewImage: function() {
        var e = this.data.qrCodeImg, a = wx.env.USER_DATA_PATH + "/e-invoice" + Date.parse(new Date()) + ".png", t = e.replace(/^data:image\/\w+;base64,/, ""), n = wx.getFileSystemManager();
        n.writeFileSync(a, t, "base64"), n.close(), this.setData({
            localImgUrl: a
        }), wx.previewImage({
            urls: [ a ]
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})