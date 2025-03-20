import dayjs from 'dayjs'

const project = {}

/**
 * 格式化时间
 * @param {*} date 时间
 * @param {*} format 格式
 * @returns
 */
project.formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return date ? dayjs(date).format(format) : null
}

export default project
