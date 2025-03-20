<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time" flex="main:center cross:center">
      {{ time }}
    </div>
    <div class="page-login--layer">
      <div class="page-login--content" flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-main" flex="dir:top main:center cross:center">
          <!-- logo -->
          <div class="page-login--logo">
            <span class="page-login--logo-title">{{ processTitle }}</span>
          </div>

          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form ref="loginForm" label-position="top" :rules="loginRules" :model="loginForm" @submit.native.prevent>
                <el-form-item prop="username">
                  <el-input type="text" v-model="loginForm.username" placeholder="用户名">
                    <i slot="prepend" class="el-icon-user"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="loginForm.password" placeholder="密码">
                    <i slot="prepend" class="el-icon-key"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                  <el-input type="text" v-model="loginForm.captcha" placeholder="验证码">
                    <template slot="append">
                      <img class="login-captcha" :src="captcha.image" @click="getCaptcha">
                    </template>
                  </el-input>
                </el-form-item>
                <el-button size="default" @click="submit" native-type="submit"  type="primary" class="button-login">
                  登录
                </el-button>
              </el-form>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import { authCaptcha } from '@/api/auth/admin'
export default {
  data () {
    return {
      processTitle: process.env.VUE_APP_TITLE,
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 表单
      loginForm: {
        username: null,
        password: null,
        captcha: null,
        uuid: null
      },
      // 表单校验
      loginRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      // 验证码
      captcha: {
        uuid: null,
        image: null
      }
    }
  },
  mounted () {
    this.getCaptcha()
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    // 获取验证码
    getCaptcha () {
      authCaptcha().then(result => {
        this.captcha = result.data
      })
    },
    // 提交登录信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loginForm.uuid = this.captcha.uuid
          // 登录
          this.login({
            login: this.loginForm
          }).then(() => {
            // 重定向对象不存在则返回顶层路径
            this.$router.replace(this.$route.query.redirect || '/')
          }).catch(() => {
            // 失败刷新验证码
            this.getCaptcha()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.page-login {
  // @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;

  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }

  .page-login--layer-area {
    overflow: hidden;
  }

  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }

  // 登陆页面控件的容器
  .page-login--content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 500px;
  }

  // main
  .page-login--logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2em;
    margin-top: -2em;

    .page-login--logo-title {
      font-size: 28px;
      font-weight: bold
    }
  }

  // 登录表单
  .page-login--form {
    width: 280px;

    // 卡片
    .el-card {
      margin-bottom: 15px;
    }

    // 登录按钮
    .button-login {
      width: 100%;
    }

    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }

    // 验证码
    .login-captcha {
      width: 100px;
      height: 38px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }

  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;

    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;

      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }

        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }

      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }

      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }

      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }

      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }

      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }

      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }

      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }

      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }

      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }

      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
