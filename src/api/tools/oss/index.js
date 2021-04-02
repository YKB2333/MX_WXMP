import http from '@/utils/http'
import { baseURL } from '@/config'
import { SERVICE } from '../index'

export function uploadFile(storagePrefix, tempFilePage) { // storagePrefix存储目录, tempFilePage本地临时路径

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${baseURL}${SERVICE}/ignore/oss/upload?storagePrefix=${storagePrefix}`,
      filePath: tempFilePage,
      name: 'file',
      success: (res) => {
        // console.log(res)
        try {
          let response = JSON.parse(res.data)
          if (response.success) {
            resolve(response.data)
          } else {
            uni.showToast({ title: '上传失败，请重试', icon: 'none' })
            reject()
          }
        } catch (e) {
          uni.showToast({ title: '上传失败，请重试', icon: 'none' })
          reject()
        }
      },
      fail: () => {
        uni.showToast({ title: '上传失败，请重试', icon: 'none' })
        reject()
      }
    })
  })
}
