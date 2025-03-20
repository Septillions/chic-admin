import utils from '@/utils'

// 菜单 顶栏
// export const menuHeader = []

// 菜单 侧边栏
// export const menuAside = []

/**
 * 将数据源处理为菜单树
 * @param array
 * @returns {{header: Array, aside: Array}}
 */
function getMenuData (array) {
  const tree = { header: [], aside: [] }
  array.forEach(value => {
    // 类型为菜单
    if (value.type !== 1) {
      return
    }
    // 储存顶部(父节点)数据
    const item = {
      path: value.url,
      title: value.name,
      icon: value.icon,
      description: value.description,
      type: value.type
    }
    if (value.parentId === '0') {
      tree.header.push({ ...item })
    }
    // 处理子节点数据
    item.id = value.id
    item.parentId = value.parentId
    tree.aside.push(item)
  })
  tree.aside = utils.formatDataToTree(tree.aside)
  return tree
}

export default {
  install (vm, source) {
    const { header, aside } = getMenuData(source)
    // 设置顶栏菜单
    vm.commit('menu/headerSet', header)
    // 设置侧边栏菜单
    vm.commit('menu/asideSet', aside)
    // 初始化菜单搜索功能
    vm.commit('search/init', aside)
  }
}
