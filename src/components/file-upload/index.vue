<template>
  <div>
    <el-upload action="" :file-list="fileList" :before-upload="beforeUpload" :http-request="handleUpload"
      :on-remove="handleRemove" :list-type="fileType" :limit="limit" :class="fileList.length >= limit ? 'hide-button' : ''">
      <i v-if="fileType === 'picture-card'" class=" el-icon-plus"></i>
      <el-button v-else size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
import OSS from 'ali-oss'
import dayjs from 'dayjs'
import * as api from './api'

export default {
  name: 'file-upload',
  data () {
    return {
      fileList: [],
      listType: null,
      ossClient: null
    }
  },
  props: {
    fileUrl: {
      type: String
    },
    fileDir: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      default: 'text'
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  watch: {
    fileUrl: {
      immediate: true,
      handler (val) {
        if (val) {
          // 判断是否为JSON数组字符串
          if (val.startsWith('[')) {
            const arr = JSON.parse(val)
            this.fileList = arr.map(item => {
              return {
                name: item,
                url: item
              }
            })
          } else {
            this.fileList = [{
              name: val,
              url: val
            }]
          }
        } else {
          this.fileList = []
        }
      }
    }
  },
  methods: {
    // 获取sts授权
    async getSts () {
      const result = await api.getOssSts()
      const { accessKeyId, accessKeySecret, securityToken, bucket, region } = result.data
      this.ossClient = new OSS({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: securityToken,
        bucket: bucket,
        region: region
      })
    },
    // 上传前的操作
    async beforeUpload (file) {
      // 获取sts授权
      await this.getSts()
      return true
    },
    // 上传文件
    async handleUpload ({ file }) {
      // 文件名
      const fileName = dayjs().format('YYYYMMDDHHmmssSSS') + '.' + file.name.split('.').pop()
      // 直传到 OSS
      const result = await this.ossClient.put(this.fileDir + fileName, file)
      this.fileList.push({ name: result.url, url: result.url })
      if (this.limit === 1) {
        this.$emit('update:fileUrl', this.fileList[0].url)
      } else {
        this.$emit('update:fileUrl', JSON.stringify(this.fileList.map(item => item.url)))
      }
    },
    handleRemove (file) {
      this.fileList.splice(this.fileList.indexOf(file), 1)
      if (this.limit === 1) {
        this.$emit('update:fileUrl', this.fileList.length > 0 ? this.fileList[0].url : '')
      } else {
        this.$emit('update:fileUrl', JSON.stringify(this.fileList.map(item => item.url)))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hide-button {
  ::v-deep .el-upload {
    display: none;
  }
}
</style>
