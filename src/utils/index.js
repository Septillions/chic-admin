import cookies from './cookies'
import db from './db'
import log from './log'

const utils = {
  cookies,
  db,
  log
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
utils.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'Chic Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
utils.open = function (url) {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('link-temp'))
}

export default utils
