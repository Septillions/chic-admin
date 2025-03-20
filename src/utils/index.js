import cookies from './cookies'
import db from './db'
import log from './log'
import project from './project'

const utils = {
  cookies,
  db,
  log,
  project
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

/**
 * 将任意对象转化为树
 *
 * @param {Array} data - 要格式化为树形结构的数据
 * @param {string} [key='id'] - 用于标识数据中每个对象的键
 * @param {string} [pid='parentId'] - 用于标识数据中每个对象的父级对象的键
 * @param {number} [level=0] - 树的深度
 * @return {Array} 格式化为树形结构的数据
 */
utils.formatDataToTree = (data, key = 'id', pid = 'parentId', level = 0) => {
  const tree = []
  const map = {}
  // 构建映射表
  data.forEach(item => {
    map[item[key]] = { ...item }
  })
  // 遍历数据，构建树形结构
  data.forEach(item => {
    const parent = map[item[pid]]
    if (parent) {
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(map[item[key]])
    } else {
      tree.push(map[item[key]])
    }
  })
  // 如果 level 不为 0，则限制树的深度
  if (level > 0) {
    return utils.limitTreeDepth(tree, level)
  }
  return tree
}

/**
 * 限制树的深度
 *
 * @param {Array} tree - 树
 * @param {number} level - 树的深度
 * @return {Array} 树
 */
utils.limitTreeDepth = (tree, level) => {
  if (level === 1) {
    return tree.map(node => ({ ...node, children: undefined }))
  }
  return tree.map(node => ({
    ...node,
    children: node.children && node.children.length ? utils.limitTreeDepth(node.children, level - 1) : []
  }))
}

export default utils
