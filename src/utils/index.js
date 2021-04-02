
//数据转化  
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：格式
 * 使用：formatTime(1563896613713, 'Y/M/D h:m')
*/
export function formatTime(timestap, format) {
  if (!timestap) {
    return ''
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(timestap);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 为空判断
export function isEmpty(obj) {
  if (Array.isArray(obj) && obj.length == 0) {
    return true
  } else if (typeof obj == 'undefined' || obj == null) {
    return true
  } else if (typeof obj == 'string' && obj.trim() == '') {
    return true
  } else if (typeof obj == 'object' && JSON.stringify(obj) == "{}") {
    return true
  } else {
    return false
  }
}

// 返回默认第一条sku的值(接收skuList和键，返回对应键值)
export function formatSkuListValue(skuList, key) {
  let isNullList = isEmpty(skuList)
  if (key === 'imgUrl') {
    if (!isNullList && !isEmpty(skuList[0].skuImages)) {
      return skuList[0].skuImages[0].imgUrl || ''
    }
    return ''
  } else if (key === 'skuImagesPos') {
    if (!isNullList && !isEmpty(skuList[0].skuImagesPos)) {
      return skuList[0].skuImagesPos[0].imgUrl || ''
    }
    return ''
  } else if (key === 'salesPrice') {
    if (isNullList) {
      return 0
    } else {
      return skuList[0].salesPrice || 0
    }
  } else {
    if (isNullList) {
      return null
    } else {
      let sku = skuList[0]
      return sku[key]
    }
  }
}

// 手机号码校验
export function validPhone(phone) {
  return (/^1[3456789]\d{9}$/.test(phone))
}

// 判断两个对象是否相等
export function isObjectEqual(a, b) {
  // 获取两个对象的键名
  let aKeyNames = Object.getOwnPropertyNames(a)
  let bKeyNames = Object.getOwnPropertyNames(b)

  // 如果两个键名数组长度不相等，返回false
  if (aKeyNames.length !== bKeyNames.length) {
    return false
  }
  // 比对键名对应的键值是否相等
  for (let i = 0; i < aKeyNames.length; i++) {
    let propName = aKeyNames[i]
    let propA = a[propName]
    let propB = b[propName]
    if (propA !== propB) {
      return false
    }
  }
  return true
}

/**
 * 函数节流
 * <button @tap='onClick'>按钮</button>
 * onClick: util.throttle((e) => {}, 800)
 */
export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

/**
 * 时间对比工具，返回endDate > startDate
 * @param {*} startDate 
 * @param {*} endDate 
 */
export function complareToDiffTime(startDate, endDate){
  if (!startDate || !endDate) return false
  let startTime = new Date(startDate.replace(/-/g,"/")).getTime()
  let endTime = new Date(endDate.replace(/-/g,"/")).getTime()
  return endTime - startTime > 0
}

/**
 * 时间对比工具，返回endDate > now
 * @param {*} endDate 
 */
export function complareToNowTime(endDate){
  if (!endDate) return false
  let startTime = new Date().getTime()
  let endTime = new Date(endDate.replace(/-/g,"/")).getTime()
  return endTime - startTime > 0
}

export function copyToClipboard(data){
  if(data){
    data = data.replace(/<[^>]+>/g,"") //去掉所有的html标记
    uni.setClipboardData({
        data: data,
        success: function () { // 复制成功系统会自动弹窗toast
            // uni.showToast({
            //     title: '复制成功',
            //     icon: 'none',
            //     duration: 800
            // });
        }
    })
  }
}


// 防抖函数
export function debounce(fn,delay) {
  let timer
  let delays =  delay || 200
  // 使用闭包，保证每次使用的定时器是同一个
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this, args)
      // 结束之后清除定时器
      clearTimeout(timer)
    }, delays)
  }
}

// 节流函数
export function throttles(fn,delay){
  let timer
  let delays =  delay || 200
  return function(...args) {
    if(!timer) {
      timer = setTimeout(()=>{
        clearTimeout(timer)
        timer = null
      }, delays)
      // fn(d);
      fn.apply(this, args)
    }
  }
}

// 身份证校验
export function checkIdCard(identityCard) {
  let isMatch = (/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/).test(identityCard)
 
  //香港身份证号码校验
  //开头一位或两位大写字母，然后接上6-10位数字，最后一位数字或字母校验
  let isMatchHongKong = (/^[A-Z]{1,2}[0-9]{6,10}[0-9A-Z]$/).test(identityCard)
  
  //澳门身份证号码校验
  //开头数字1或者5或者7，然后接上6位数字，再接上一位数字或者大写字母校验
  let isMatchAoMen = (/^[1|5|7][0-9]{6}[0-9A-Z]$/).test(identityCard)
  
  //台湾身份证号码校验
  //开头一位小写或者大写字母，接上9位数字
  let isMatchTaiWan = (/^[a-zA-Z][0-9]{9}$/).test(identityCard)

  return isMatch || isMatchHongKong || isMatchAoMen || isMatchTaiWan
}

// 把数组里的相同的键值的对象分配到各自的数组中
// arr: 数组 str: key
// 按照特定方式格式化
export function sortArr(arr, str) {
  var _arr = [],
      _t = [],
      // 临时的变量
      _tmp;

  // 按照特定的参数将数组排序将具有相同值得排在一起
  arr = arr.sort(function(a, b) {
      var s = a[str],
          t = b[str];
      return s < t ? -1 : 1;
  });

  if ( arr.length ){
      _tmp = arr[0][str];
  }
  // console.log( arr );
  // 将相同类别的对象添加到统一个数组
  for (var i in arr) {
      // console.log( _tmp);
      if ( arr[i][str] === _tmp ){
          // console.log(_tmp)
          _t.push( arr[i] );
      } else {
          _tmp = arr[i][str];
          _arr.push( {list:_t} );
          _t = [arr[i]];
      }
  }
  // 将最后的内容推出新数组
  _arr.push( {list:_t} );
  return _arr;
}