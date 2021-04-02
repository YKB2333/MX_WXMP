

module.exports = {
  ...require(`./${process.env.VUE_APP_ENV}`),
  // 请求超时时间：60秒
  timeout: 60 * 1000,
  // 请求头部里携带token的键名
  headersTokenKey: 'authorization',
  // 修改账户密码时发送短信templateCode
  templateCode: 'SMS_173765864',
  // 提现银行
  withdrawBanks: ['中国工商银行', '中国农业银行', '中国建设银行', '招商银行', '中国银行', '浦发银行', '广发银行', '中国民生银行', '平安银行', '中国光大银行', '兴业银行', '中信银行', '中国邮政储蓄银行', '中国交通银行'],
  shareText: '秒寻精选',
  kd100AppId: 'wx6885acbedba59c14',
  // h5页面
  H5: {
    // 用户协议
    userProtocol: 'https://mx.gz-zhongshang.com/config/h5/userProtocol/index.html',
    // 隐私政策
    privacy: 'https://mx.gz-zhongshang.com/config/h5/privacy/index.html',
    // 会员权益规则
    vipRule: 'https://mx.gz-zhongshang.com/config/h5/svip/rule/index.html',
    // 关于我们
    aboutUs: 'https://mx.gz-zhongshang.com/config/h5/aboutme/aboutme.html'
  },
  // 与app设置的userAgent保持一致，h5可以根据navigator.userAgent判断当前环境
  userAgent: 'FlutterApp',
  // 调用flutter通道名称，要与flutter设置的保持一致
  javascriptChannelName: 'flutter',
}