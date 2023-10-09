<template>
  <div class="navi">
    <el-collapse v-model="activeName">
      <el-collapse-item v-for="(item, index) in menuData" :key="`parent${index}`" :name="item.id">
        <template slot="title">
          <icon v-if="item.icon" class="navi__title iconfont__mini" :name="item.icon" />
          <i v-else class="navi__title el-icon-folder" />
          <span>{{ item.title }}</span>
        </template>
        <div class="flex-wrap">
          <div v-for="(sub, key) in item.children" :key="`sub${key}`" class="navi__block"
            @click="handleMenuSelect(sub.path)">
            <div class="navi__content">
              <div class="navi__icon">
                <icon v-if="sub.icon" class="iconfont__medium" :name="sub.icon" />
                <i v-else class="el-icon-document" />
              </div>
              <div class="navi__info">
                <p class="navi__sub_title">
                  <i v-if="sub.route === 2" class="el-icon-link base-pr-5" />
                  <span>{{ sub.title }}</span>
                </p>
                <p class="navi__desc" :title="sub.description">{{ sub.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import menuMixin from '@/layout/header-aside/components/mixin/menu'

export default {
  props: {
    // 外部v-model值
    value: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      menuData: [],
      activeName: []
    }
  },
  mixins: [
    menuMixin
  ],
  computed: {
    ...mapState('menu', [
      'aside'
    ])
  },
  watch: {
    aside: {
      handler (val) {
        const { menu, active } = this.dataInit(val)
        this.menuData = menu
        this.activeName = active
      },
      immediate: true
    }
  },
  methods: {
    dataInit (val) {
      const menu = []
      const active = []
      const key = val.findIndex(item => item.path === this.value)
      if (key !== -1 && val[key].children) {
        for (const item of val[key].children) {
          if (this.$route.path === item.path) {
            continue
          }
          menu.push(item)
          active.push(item.id)
        }
      }
      return { menu, active }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  margin: -15px auto -10px;
}

.navi {
  padding: 20px;
  background-color: #FFF;

  .navi__title {
    width: 20px;
    color: $color-info;
    font-size: 16px;
    padding-left: 3px;
  }

  .iconfont__mini {
    width: 22px;
    font-size: 20px;
    padding-left: 0;
  }

  .iconfont__medium {
    font-size: 40px;
  }

  .navi__block {
    width: 20%;
    box-sizing: border-box;
    padding: 0 7.5px;
    margin-top: 15px;
  }

  .navi__content {
    display: flex;
    cursor: pointer;
    color: $color-info;
    border-radius: 4px;
    background-color: #F5F7FA;
    padding: 10px;
    overflow: hidden;
  }

  .navi__icon {
    @extend %flex-center-row;
    min-width: 60px;
    font-size: 32px;
  }

  .navi__info {
    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .navi__sub_title {
      color: $color-text-main;
      height: 24px;
      font-size: 14px;
      font-weight: bold;
    }

    .navi__desc {
      font-size: 12px;
      height: 23px;
    }
  }
}
</style>
