// 读取文件的工具方法
const fs = require('fs')
module.exports.getFileJsonData = (filepath) => {
  //根据文件路径，读取文件内容
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (error,data) => {
      if(error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}