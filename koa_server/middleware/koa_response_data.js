// 处理业务逻辑的中间件，读取某个json文件的数据
const path = require('path')
const fileUtils = require('../utils/file_utils')
module.exports = async (ctx, next) => {
  // 根据url，拼接文件路径
  const url = ctx.request.url                // /api/seller
  let filepath = url.replace('/api','')
  filepath = '../data' + filepath + '.json'   // ../data/seller.json
  filepath = path.join(__dirname, filepath)   //本文件的绝对路径和filepath拼接
  try {
    const ret = await fileUtils.getFileJsonData(filepath)
    ctx.response.body = ret;
  } catch(error) {
    const errorMsg = {
      message: '读取文件内容失败，文件资源不存在',
      status: 404
    }
    ctx.response.body = JSON.stringify(errorMsg)
  }
  await next()
}