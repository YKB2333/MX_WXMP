export {
  formatTime,
  formatSkuListValue
} from '@/utils'
import { NULL_GOODS_IMG } from '@/imageConfig'

// 从spu里的attributeKeys里获取图片显示
export function getSpuImgOnAttr(spu) {
  let result = ''
  if (spu && spu.skuList && spu.skuList.length) {
    let attrValueId = spu.skuList[0].attrValueId // 第一个sku
    let totalImgs = []
    spu.attributeKeys.forEach((a, i) => {
      a.values.forEach((b, j) => {
        if (b.skuImages && b.skuImages.length) {
          totalImgs = totalImgs.concat(b.skuImages)
        }
      })
    })
    let target = totalImgs.find(img => img.attrValueId === attrValueId && img.imgUrl)
    if (target) {
      result = target.imgUrl
    }
  }
  // console.log(result)
  return result
}

// 根据sku的attrValueId获取skuImages里对应的图片
export function formatSkuImg(skuImages, attrValueId) {
  if (skuImages && skuImages.length) {
    let target = skuImages.find(ele => ele.attrValueId === attrValueId)
    if (target && target.imgUrl) {
      return target.imgUrl
    } else {
      return NULL_GOODS_IMG
    }
  } else {
    return NULL_GOODS_IMG
  }
}

// 返回sku属性值（数组格式：['42码', '白色']）
export function formatSkuValues(ownSpec) {
  if (!ownSpec) return []
  let json = JSON.parse(ownSpec)
  let values = []
  Object.keys(json).forEach(key => {
    values.push(json[key])
  })
  // console.log(values)
  return values
}

// 解决富文本图片超出问题
export function formatRichTextImg(content) {
  if (!content) return ''
  return content.replace(/<img/g, '<img style="max-width:100%;height:auto" ')
}

// 商品重量转换（g => kg），保留一位小数
export function formatWeight(val) {
  let result = val || 0
  return (result / 1000).toFixed(2) + 'kg'
}

// 日期字符串格式化
export function formatTimeStr(strTime) {
  if (!strTime) return ''
  let a = strTime.split(" ")
  let ymd = a[0].split("-")
  let hms = a[1].split(":")
  let date = new Date(ymd[0], ymd[1], ymd[2], hms[0], hms[1], hms[2])
  let nowDate = new Date()
  if (date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth() && date.getDate() === nowDate.getDate()) {
    let time = (nowDate.getTime() - date.getTime()) / 1000
    if (time <= 60) {
      return "刚刚"
    } else {
      time = time / 60
      if (time < 60) {
        return Math.floor(time) + "分钟前"
      } else {
        time = time / 60
        if (time < 24) {
          return Math.floor(time) + "小时前"
        } else {
          return a[0]
        }
      }
    }
  } else {
    return a[0]
  }
}

//
export function formatDateStr(strTime,fmt) {
  var date = new Date(strTime)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
}


export function formatCommentTime(strTime) {
  if (!strTime) return ''
  let lastIndex = strTime.lastIndexOf(':')
  if (lastIndex >= 0) {
    return strTime.substr(0, lastIndex)
  } else {
    return ''
  }
}

// 手机号码隐藏中间部分
export function formatMobile(value) {
  return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

// 加密姓名，只显示姓，名称用*代替
export function encrypName(name) {
  // return name.replace(/(?<=.)./g, '*') // 正则里有<=， IOS下会白屏
  if (!name) return ''
  return name.substr(0, 1) + new Array(name.length).join('*')
}

// 订单号中间使用星号显示
export function formatOrderNo(value) {
  if (!value) return ''
  return value.replace(/^(\d{3})\d+(\d{4})$/, '$1*****$2')
}

// 计算未来某个时间与当前时间的差值
export function formatDiffTime(endTime) {
  if (!endTime) return ''
  let end = new Date(endTime.replace(/-/g, "/")).getTime() // 将'-'替换成'/'再转为时间戳（'-'部分机型会返回 undefined 或者 Invalid date）
  let cur = new Date().getTime()
  let diff = end - cur
  if (diff <= 0) return 0
  //计算出相差天数  
  let days = Math.floor(diff / (24 * 3600 * 1000))
  //计算出小时数
  let a = diff % (24 * 3600 * 1000)    // 计算天数后剩余的毫秒数  
  let hours = Math.floor(a / (3600 * 1000))
  //计算相差分钟数  
  let b = a % (3600 * 1000)        //计算小时数后剩余的毫秒数  
  let minutes = Math.floor(b / (60 * 1000))
  return `${days}天${hours}时${minutes}分`
}

export function forArticleImg(arr) {
  for (let item of arr) {
    if (item.cover == 1) {
      return item.smallSizeUrl
    }
  }
}

export function formatMoney(val, isDivide = true) { // isDivide: 是否/100
  if (!val) return '0.00'
  if (isDivide) {
    val = (val / 100).toString().replace(/\$|\,/g, '')
  } else {
    val = val.toString().replace(/\$|\,/g, '')
  }
  if (isNaN(val)) {
    return '0.00'
  }
  let sign = (val == (val = Math.abs(val)))
  val = Math.floor(val * 100 + 0.50000000001)
  let cents = val % 100
  val = Math.floor(val / 100).toString()
  if (cents != 0 && cents < 10) {
    cents = "0" + cents
  }
  for (var i = 0; i < Math.floor((val.length - (1 + i)) / 3); i++) {
    val = val.substring(0, val.length - (4 * i + 3)) + ',' + val.substring(val.length - (4 * i + 3))
  }
  if(cents == 0){
    return (((sign) ? '' : '-') + val )
  }
  return (((sign) ? '' : '-') + val + '.' + cents)
}

export function million(value) {//过万处理
  let num;
  if (value > 9999) {//大于9999显示x.xx万
    num = (Math.floor(value / 1000) / 10) + 'W';
  } else if (value < 9999 && value > -9999) {
    num = value || 0
  } else if (value < -9999) {//小于-9999显示-x.xx万
    num = -(Math.floor(Math.abs(value) / 1000) / 10) + 'W'
  }
  return num;
}