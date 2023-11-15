<template>
  <div class="login-container">
    <el-row style="height:80px;" />
    <el-card style="width:70%;margin:auto;height:500px;">
      <el-container style="height:480px;">
        <el-aside width="50%" style="padding:0 0 0 0">
          <el-image
            style="height:455px"
            src="https://github.com/CANDYFLOSSKKI/smartport_photo/raw/master/img/portback.png"
            fit="fill"
          />
        </el-aside>
        <el-main width="50%" style="padding-top:0px;">
          <el-row style="height:10px;" />
          <el-row style="height:40px;"><div class="title-container">港口自助办单系统</div></el-row>
          <div v-if="showLogin">
            <el-form ref="loginForm" :model="loginForm" class="login-form" auto-complete="on" label-position="left">
              <el-form-item prop="account">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="account" v-model="loginForm.account" prefix-icon="el-icon-user-solid" placeholder="用户名/邮箱" name="account" type="text" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="password">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="password" v-model="loginForm.password" prefix-icon="el-icon-lock" :type="passwordType" show-password placeholder="密码" name="password" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-row>
                <el-col style="text-align: center;">
                  <el-button :disabled="isLogin" :loading="loading" type="primary" style="width:30%;" @click.native.prevent="handleLogin">登录</el-button>
                  <el-button :loading="loading" type="success" style="width:30%;" @click.native.prevent="pageSwitch">注册</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div v-if="showSignUp">
            <el-form ref="signupForm" :model="signupForm" class="signup-form" label-position="left">
              <el-form-item prop="grade" border="true" size="medium">
                <el-row style="height:20px;text-align:center;">
                  <el-radio v-model="signupForm.grade" :label="1" :disabled="isRatioAble">客户用户</el-radio>
                  <el-radio v-model="signupForm.grade" :label="2" :disabled="isRatioAble">审批用户</el-radio>
                </el-row>
              </el-form-item>
              <el-form-item prop="code">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="code" v-model="signupForm.employee.code" prefix-icon="el-icon-key" placeholder="工号" name="code" type="text" :disabled="isEmployeeAble" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="name">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="name" v-model="signupForm.employee.name" prefix-icon="el-icon-s-management" placeholder="姓名" name="name" type="text" :disabled="isEmployeeAble" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="account">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="account" v-model="signupForm.account" prefix-icon="el-icon-user-solid" placeholder="用户名" name="account" type="text" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="password">
                <el-row style="height:40px;text-align:center;">
                  <el-col :span="16" :offset="4">
                    <el-input ref="password" v-model="signupForm.password" prefix-icon="el-icon-lock" :type="passwordType" show-password placeholder="密码" name="password" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-row>
                <el-col style="text-align: center;">
                  <el-button :disabled="isEmployeeConfirm" :loading="loading" type="primary" style="width:30%;" @click.native.prevent="confirmEmployee">工作证检查</el-button>
                  <el-button :disabled="isRegister" :loading="loading" type="success" style="width:30%;" @click.native.prevent="handleSignup">注册</el-button>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-col style="text-align: center;">
                  <el-button :loading="loading" type="danger" style="width:30%;" @click.native.prevent="resetSignUpForm">重置表单</el-button>
                  <el-button :loading="loading" type="info" style="width:30%;" @click.native.prevent="pageSwitch">返回登录</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-main>
      </el-container>
    </el-card>

  </div>
</template>

<script>
import { signup, confirm } from '@/api/user'
import { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/base.css'

export default {
  name: 'Login',
  data() {
    return {
      showLogin: true,
      showSignUp: false,
      isRatioAble: false,
      isEmployeeAble: true,
      loginForm: { account: '', password: '' },
      signupForm: {
        account: '',
        password: '',
        grade: 1,
        employee: { code: '', name: '' }
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    isLogin() { return !((this.loginForm.account.length >= 3) && (this.loginForm.password.length >= 3)) },
    isRegister() { return !((this.signupForm.account.length >= 3) && (this.signupForm.password.length >= 3) && ((this.isRatioAble) || (this.signupForm.grade === 1))) },
    isEmployeeConfirm() { return !((this.signupForm.employee.code.length >= 3) && (this.signupForm.employee.name.length >= 2)) }
  },
  watch: {
    $route: {
      handler: function(route) { this.redirect = route.query && route.query.redirect },
      immediate: true
    },
    'signupForm.grade': { handler(grade) { this.switchSignupMode(grade) } }
  },
  methods: {
    signup,
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else { this.passwordType = 'password' }
      this.$nextTick(() => { this.$refs.password.focus() })
    },
    handleLogin() {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        if (this.$store.getters.flag === true) { this.$router.push({ path: '/' }) }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    pageSwitch() {
      if (this.showLogin) {
        this.showLogin = false
        this.showSignUp = true
        this.resetLoginForm()
      } else {
        this.showSignUp = false
        this.showLogin = true
        this.resetSignUpForm()
      }
    },
    resetLoginForm() {
      this.loginForm.account = ''
      this.loginForm.password = ''
    },
    resetSignUpForm() {
      this.signupForm.grade = 1
      this.isEmployeeAble = true
      this.resetSignupInfo()
    },
    switchSignupMode(newGrade) {
      this.isEmployeeAble = newGrade !== 2
      this.resetSignupInfo()
    },
    resetSignupInfo() {
      this.isRatioAble = false
      this.signupForm.account = ''
      this.signupForm.password = ''
      this.signupForm.employee.name = ''
      this.signupForm.employee.code = ''
    },
    confirmEmployee() {
      this.loading = true
      const { code, name } = this.signupForm.employee
      confirm({ code: code, name: name }).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          this.isEmployeeAble = true
          this.isRatioAble = true
          Message.success('验证成功')
        } else { Message.warning(mes) }
        this.loading = false
      }).catch(response => { this.loading = false })
    },
    handleSignup() {
      this.loading = true
      const { account, password, grade, employee } = this.signupForm
      signup({
        account: account,
        password: password,
        grade: grade,
        employee: { code: employee.code, name: employee.name }
      }).then(response => {
        const { flag, mes } = response
        if (flag === true) {
          Message.success('注册成功')
          this.pageSwitch()
        } else { Message.warning(mes) }
        this.loading = false
      }).catch(response => { this.loading = false })
    }
  }
}
</script>

<style>
@font-face {
  font-family: "title-font";
  font-weight: 400;
  src: url("../../icons/font/title.woff2") format("woff2"),
  url("../../icons/font/title.woff") format("woff");
  font-display: swap;
}
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 60px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .signup-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 30px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {margin-right: 16px;}
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    font-family: title-font;
    font-size: 26px;
    text-align: center;
    user-select: none;
  }
}
</style>
